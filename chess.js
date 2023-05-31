import lib from "./lib.js";
import chessDefaultList from "./chessList.json" assert { type: "json" };
class ChessPiece {
  constructor(chessName, level) {
    const chess = chessDefaultList[chessName];
    this.level = level || 1;
    Object.assign(this, chess);
  }
  // 攻擊對手棋子
  attackPiece(opponentPiece) {
    if (opponentPiece.race === this.getCounter()) {
      opponentPiece.health -= this.attack * 1.5;
    } else {
      opponentPiece.health -= this.attack;
    }
    if (opponentPiece.health <= 0) {
      opponentPiece.health = 0;
      console.log(`${opponentPiece.name} was defeated.`);
    } else {
      console.log(
        `${this.name} attacked ${opponentPiece.name}. ${opponentPiece.name}'s health is now ${opponentPiece.health}.`
      );
    }
  }

  // 獲取種族
  getRace() {
    return this.race;
  }

  // 獲取效果
  getCounter() {
    return this.counter;
  }

  getPrice() {
    const chessNum = 3 ** (this.level - 1);
    if (this.level === 1) return this.price;
    return this.price * 0.8 * chessNum;
  }

  // 獲取加成
  getBonus() {
    const levelBonusList = [1, 1.6, 1.5, 1.4, 1.3, 1.5];
    // 假設加成是攻擊力的 10%
    this.attack = this.attack * levelBonusList[this.level + 1];
    this.health = this.health * this.levelBonusList[this.level + 1];
  }
  levelUp() {
    this.level++;
    this.getBonus();
  }

  // 頁面事件
  drag(element, type, typeIndex, Board, User, Shop) {
    element.addEventListener("drag", (event) => {
      playerPieceDrag(event, element);
    });
    element.addEventListener("dragstart", (event) => {
      const { offsetX, offsetY } = event;
      element.dataset.offsetX = offsetX;
      element.dataset.offsetY = offsetY;
    });
    element.addEventListener(
      "dragover",
      (event) => {
        event.preventDefault();
      },
      false
    );
    element.addEventListener("dragend", (event) => {
      const _Board = Board;
      const { touchLeft, touchRight, touchTop, touchBottom } = element.dataset;
      // 旗子被賣掉
      if (Shop && Shop.getDisplay()) {
        const {
          left: ShopLeft,
          right: ShopRight,
          top: ShopTop,
          bottom: SHopBottom,
        } = Shop.getScope();
        if (
          ShopTop <= touchTop &&
          ShopRight >= touchRight &&
          SHopBottom >= touchBottom &&
          ShopLeft <= touchLeft
        ) {
          const sellPrice = this.getPrice();
          User.removePiece(typeIndex);
          User.sellChess(sellPrice);
          return;
        }
      }
      // object
      const boardScopeList = _Board.getColDivScope();
      const boardIndex = boardScopeList.findIndex(
        (item) =>
          item.top <= touchTop &&
          item.right >= touchRight &&
          item.bottom >= touchBottom &&
          item.left <= touchLeft
      );
      const storageIndex = User.storageDivScope.findIndex(
        (item) =>
          item.top <= touchTop &&
          item.right >= touchRight &&
          item.bottom >= touchBottom &&
          item.left <= touchLeft
      );
      if (!~boardIndex && !~storageIndex) {
        User.renderStoragePiece();
        _Board.renderBoard();
        return;
      }

      let oldPiece = null;
      if (~boardIndex) {
        const _oldIndex = type === "board" ? typeIndex : null;
        if (_oldIndex === boardIndex) {
          _Board.renderBoard();
          return;
        }
        oldPiece = _Board.setPiece(_oldIndex, boardIndex, this);
      }
      if (~storageIndex) {
        const _oldIndex = type === "user" ? typeIndex : null;
        if (_oldIndex === storageIndex) {
          User.renderStoragePiece();
          return;
        }
        oldPiece = User.setPiece(_oldIndex, storageIndex, this);
      }
      if (type === "user") User.removePiece(typeIndex);
      if (type === "board") _Board.removePiece(typeIndex);
      if (oldPiece) {
        if (type === "user") {
          User.setPiece(null, typeIndex, oldPiece);
        } else {
          _Board.setPiece(null, typeIndex, oldPiece);
        }
      }
    });
    function playerPieceDrag(mouse, element) {
      const { clientX: mouseX, clientY: mouseY } = mouse;
      const { offsetX, offsetY } = element.dataset;
      const { offsetWidth, offsetHeight } = element;
      const touchLeft = mouseX - offsetX;
      const touchRight = mouseX + (offsetWidth - offsetX);
      const touchTop = mouseY - offsetY;
      const touchBottom = mouseY + (offsetHeight - offsetY);
      if (touchLeft < 0 || touchTop < 0) return;
      Object.assign(element.dataset, {
        touchLeft,
        touchRight,
        touchTop,
        touchBottom,
      });
      element.style.position = "fixed";
      element.style.opacity = 0;
      element.style.left = `${mouseX - offsetX}px`;
      element.style.top = `${mouseY - offsetY}px`;
    }
  }

  // getBoardScope() {
  //     return this.Board.getColDivScope()
  // }
}

export default ChessPiece;
// 創建一個自走棋棋子
// const piece = new ChessPiece(chessList[race]);

// 攻擊一個對手棋子
// const opponentPiece = new ChessPiece("Orc Warrior", "Orc", 30, 80, "None");
// piece.attackPiece(opponentPiece);
