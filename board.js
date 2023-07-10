import ChessPiece from "./chess.js";
import lib from "./lib.js";
class Board {
  constructor(rows, cols) {
    this.rows = rows || 3;
    this.cols = cols || 3;
    this.board = [];
    this.oldBoard = [];
    this.colDivScope = [];
    this.User = null;
    this.createBoard();
  }
  render() {
    this.renderBoard();
  }
  // 創建棋盤
  createBoard() {
    const board = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      board[i] = new Array(this.cols).fill(null);
    }
    this.board = board;
  }

  displayBoard() {
    return this.board;
  }

  getPiece(index) {
    const row = Math.floor(index / this.rows);
    const col = index % this.cols;
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error("Invalid position");
    }
    return this.board[row][col];
  }

  // 設置棋子
  setPiece(oldIndex, index, piece) {
    const row = Math.floor(index / this.rows);
    const col = index % this.cols;
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error("Invalid position");
    }
    let oldPiece = null;
    // 從玩家拖動到棋盤
    if (oldIndex === null) {
      if (this.board[row][col]) {
        oldPiece = this.board[row][col];
      }
      this.board[row][col] = piece;
    } else {
      const oldRow = Math.floor(oldIndex / this.rows);
      const oldCol = oldIndex % this.cols;
      const nextPieceRace = this.board[row][col]?.race;
      if (!nextPieceRace) {
        this.board[row][col] = piece;
        this.board[oldRow][oldCol] = "";
      } else {
        oldPiece = this.board[row][col];
        this.board[row][col] = piece;
      }
    }
    this.renderBoard();
    return oldPiece;
  }

  removePiece(index) {
    const row = Math.floor(index / this.rows);
    const col = index % this.cols;
    let piece = null;
    const delPiece = this.board[row][col];
    if (delPiece) {
      piece = new ChessPiece(delPiece?.race);
    }
    this.board[row][col] = null;
    this.renderBoard();
    return piece;
  }

  getRenderIndex() {
    const _boardList = this.displayBoard().flat();
    const _oldBoardList = this.oldBoard;
    const renderIndexList = _boardList.reduce((arr, item, index) => {
      if (item !== _oldBoardList[index]) {
        arr.push(index);
      }
      return arr;
    }, []);
    this.oldBoard = _boardList.slice();
    return renderIndexList;
  }

  renderBoard() {
    const _this = this
    const reRenderIndexList = _this.getRenderIndex();
    const parent = document.querySelector(".board-wrap");
    const childRowList = parent.childNodes;
    reRenderIndexList.forEach((reRenderIndexList) => {
      const rowIndex = Math.floor(reRenderIndexList / 3);
      const colIndex = reRenderIndexList % 3;
      const col = _this.board[rowIndex][colIndex];
      let rowDiv;
      if (!childRowList[rowIndex]) {
        rowDiv = lib.createDOM("div", null, { className: "board-row" });
        parent.appendChild(rowDiv);
      } else {
        rowDiv = childRowList[rowIndex];
      }
      const colWrap = lib.createDOM("div", "", {
        className: "board-col-item-wrap",
      });
      const colDiv = lib.createDOM("div", "", {
        className: "board-col-item",
      });
      const colImg = lib.createDOM("img", "", {
        src: `./static/${col?.level ? "level-" + col.level : "space"}.png`,
      });
      colImg.style.backgroundImage = `url(./static/user/${col?.name}.png)`;
      colImg.style.backgroundSize = "cover";
      colDiv.setAttribute("draggable", !!col);
      if (col) {
        const pieceIndex = rowIndex * 3 + colIndex;
        col.drag(colDiv, "board", pieceIndex, _this, _this.User);
      }
      if (col) {
        const colDivBackground = lib.createDOM("div", "", {
          className: "ready-board-col-item-background",
        });
        colDivBackground.style.height = `${
          (1 - col.health / col.fullHealth) * 100
        }%`;
        colDiv.appendChild(colDivBackground);
      }
      colDiv.appendChild(colImg);
      colWrap.appendChild(colDiv);
      const rowDivChild = rowDiv.childNodes;
      const childItem = rowDivChild[colIndex];

      if (!childItem) {
        rowDiv.appendChild(colWrap);
      } else {
        rowDiv.replaceChild(colWrap, childItem);
      }
    });
    // promise
    const colDivList = [...parent.childNodes]
      .map((row) => [...row.childNodes])
      .flat();

    setTimeout(() => {
      const _colDivScope = this.colDivScope;
      _colDivScope.length = 0;
      // 元素插入完才可以抓到元素範圍
      colDivList.forEach((item) => {
        const { left, right, top, bottom } = item.getBoundingClientRect();
        _colDivScope.push({
          left: left - 15,
          right: right + 15,
          top: top - 15,
          bottom: bottom + 15,
        });
      });
    });
  }

  getColDivScope() {
    return this.colDivScope;
  }
  setUserObject(User) {
    this.User = User;
  }
}

export default Board;
// const board = new ChessBoard();

// console.log(board)

// 清空棋盤
// board.clearBoard();
