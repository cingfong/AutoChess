import Board from "./board.js";
import Chess from "./chess.js";
import Shop from "./shop.js";
import lib from "./lib.js";
import chessDefaultList from "./chessList.json" assert { type: "json" };
class User {
  constructor(maxPieces, money, health) {
    this.maxPieces = maxPieces || 6; // 最大棋子數量
    this.money = money || 100; // 玩家擁有的金額
    this.health = health || 100; // 玩家的血量
    this.storage = [null, null, null, null, null, null]; // 玩家擁有的棋子
    this.Board = new Board();
    this.Shop = new Shop();
    this.Shop.setUserObject(this);
    this.storageDivScope = [];
    // 模擬事件
    this.testAddPiece();
  }

  render() {
    this.renderStoragePiece();
    this.renderMoney();
    this.Board.render();
    this.Shop.render();
  }

  getBoard() {
    return this.Board.displayBoard();
  }
  testAddPiece() {
    const chess1 = new Chess("cavalry", 3);
    const chess = new Chess("cavalry", 3);
    const chess2 = new Chess("cavalry", 3);
    // const chess3 = new Chess("ninja", 3);
    // const chess4 = new Chess("ninja", 3);
    // const chess5 = new Chess("ninja", 3);
    // const chess6 = new Chess("ninja", 3);
    // const chess7 = new Chess("ninja", 3);
    // const chess8 = new Chess("ninja", 3);

    this.Board.setPiece(null, 0, chess1);
    this.Board.setPiece(null, 2, chess);
    this.Board.setPiece(null, 1, chess2);
    // this.Board.setPiece(null, 3, chess3);
    // this.Board.setPiece(null, 4, chess4);
    // this.Board.setPiece(null, 5, chess5);
    // this.Board.setPiece(null, 6, chess6);
    // this.Board.setPiece(null, 7, chess7);
    // this.Board.setPiece(null, 8, chess8);
  }

  // 新增一個棋子
  addPiece(piece) {
    if (this.storage.length > this.maxPieces) {
      console.log("玩家棋子過多");
      return;
    }
    const addChessIndex = this.storage.findIndex((item) => !item);
    this.setPiece(null, addChessIndex, piece);
  }

  buyPiece(piece) {
    this.money = this.money - piece.price;
    this.addPiece(piece);
    this.makeupPieceLevel();
  }

  sellChess(price) {
    this.money = this.money + price;
    this.renderMoney();
  }

  getPiece(index) {
    return this.storage[index];
  }

  getStorage() {
    return this.storage;
  }

  setPiece(oldIndex, index, piece) {
    const nextPieceRace = this.storage[index]?.race;
    let oldPiece = null;
    // 從棋盤移來
    if (oldIndex === null) {
      if (this.storage[index]) {
        const nextPieceRace = this.storage[index]?.race;
        oldPiece = new Chess(nextPieceRace);
      }
      this.storage[index] = piece;
    } else {
      if (!nextPieceRace) {
        this.storage[index] = piece;
        this.storage[oldIndex] = null;
      } else {
        oldPiece = new Chess(nextPieceRace);
        this.storage[index] = piece;
      }
    }
    this.render();
    return oldPiece;
  }

  removePiece(index) {
    const delPiece = this.storage[index];
    let piece = null;
    if (!delPiece) {
      piece = new Chess(delPiece?.race);
    }
    this.storage[index] = null;
    this.render();
    return piece;
  }

  // 移除一個棋子
  // sellPiece(piece) {
  //   const index = this.storage.indexOf(piece);
  //   if (index === -1) {
  //     console.log("You do not have this piece.");
  //     return;
  //   }
  //   this.storage.splice(index, 1);
  // }

  // 顯示玩家擁有的棋子
  displayPieces() {
    return this.storage;
  }

  displayPiecesLength() {
    return this.storage.filter((e) => e).length;
  }

  renderStoragePiece() {
    const storagePiece = this.displayPieces();
    const parent = document.querySelector(".user-piece-wrap");
    parent.textContent = "";
    const storeDivList = [];
    storagePiece.forEach((piece, pieceIndex) => {
      const pieceWrap = lib.createDOM("div", "", {
        className: "user-piece-item-wrap",
      });
      const pieceDiv = lib.createDOM("div", piece?.chname, {
        className: "user-piece-item",
      });

      pieceDiv.setAttribute("draggable", !!piece);
      if (piece) {
        piece.drag(pieceDiv, "user", pieceIndex, this.Board, this, this.Shop);
      }
      pieceWrap.appendChild(pieceDiv);
      storeDivList.push(pieceWrap);
      parent.appendChild(pieceWrap);
    });
    setTimeout(() => {
      const _storageDivScope = this.storageDivScope;
      _storageDivScope.length = 0;
      // 元素插入完才可以抓到元素範圍
      storeDivList.forEach((item) => {
        const { left, right, top, bottom } = item.getBoundingClientRect();
        _storageDivScope.push({
          left: left - 15,
          right: right + 15,
          top: top - 15,
          bottom: bottom + 15,
        });
      });
    });
    this.Board.setUserObject(this);
  }

  getColDivScope() {
    return this.colDivScope;
  }

  getMoney() {
    return this.money;
  }

  renderMoney() {
    const _userMoney = this.getMoney().toString();
    const _moneyDom = document.querySelector(".user-money");
    const moneyDiv = lib.createDOM("span", _userMoney);
    _moneyDom.innerHTML = "";
    _moneyDom.appendChild(moneyDiv);
  }

  makeupPieceLevel() {
    const chessNameList = [];
    for (const key in chessDefaultList) {
      const chessName = chessDefaultList[key].name;
      chessNameList.push(chessName);
    }
    const getTotalChess = () => {
      return [
        ...this.Board.displayBoard().flat(Infinity),
        ...this.getStorage(),
      ];
    };

    let chessLevel = 1;
    const repeatChessFunc = (list) => {
      const groupChessList = chessNameList.map((name) => {
        return list.filter(
          (item) => item?.name === name && item?.level === chessLevel
        );
      });
      const repeatChess = groupChessList.find((e) => e.length >= 3);
      if (repeatChess) {
        const getRepeatChess = (list) => {
          return list.reduce((list, item, index) => {
            if (!item) return list;
            if (item.name !== repeatName) return list;
            if (item.level !== chessLevel) return list;
            list.push(index);
            return list;
          }, []);
        };
        const removeForeach = (list, Class) => {
          list.forEach((e) => {
            Class.removePiece(e);
          });
        };
        const repeatName = repeatChess[0].name;
        const boardRepeatChess = getRepeatChess(
          this.Board.displayBoard().flat(Infinity)
        );
        const userRepeatChess = getRepeatChess(this.getStorage());
        removeForeach(boardRepeatChess, this.Board);
        removeForeach(userRepeatChess, this);
        const chessLevelUp = new Chess(repeatName, chessLevel + 1);
        this.addPiece(chessLevelUp);
        chessLevel++;
        repeatChessFunc(getTotalChess());
      }
    };
    repeatChessFunc(getTotalChess());
  }
}
export default User;
// 創建一個玩家
// const player = new Player(8, 100, 1000);

// // 新增一個棋子
// const piece1 = new ChessPiece("Piece 1", "Human", 30, 80, "Stun");
// player.addPiece(piece1);

// // 顯示玩家擁有的棋子
// player.displayPieces();

// // 新增一個棋子
// const piece2 = new ChessPiece("Piece 2", "Elf", 35, 90, "Silence");
// player.addPiece(piece2);

// // 顯示玩家擁有的棋子
// player.displayPieces();

// // 移除一個棋子
// player.removePiece(piece1);

// // 顯示玩家擁有的棋子
// player.displayPieces();
