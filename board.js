import lib from "./lib.js";
class Board {
  constructor(rows, cols) {
    this.rows = rows || 3;
    this.cols = cols || 3;
    this.board = [];
    this.colDivScope = [];
    this.User = null;
    this.createBoard();
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

  // 設置棋子
  setPiece(oldIndex, index, piece) {
    const row = Math.floor(index / this.rows);
    const col = index % this.cols;
    if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
      throw new Error("Invalid position");
    }
    // 從玩家拖動到棋盤
    if (oldIndex === null) {
      this.board[row][col] = piece;
    } else {
      const oldRow = Math.floor(oldIndex / this.rows);
      const oldCol = oldIndex % this.cols;
      const nextPiece = this.board[row][col];
      if (!nextPiece) {
        this.board[row][col] = piece;
        this.board[oldRow][oldCol] = "";
      } else {
        const oldPiece = {};
        Object.assign(oldPiece, nextPiece);
        this.board[row][col] = piece;
        this.board[oldRow][oldCol] = oldPiece;
      }
    }
    this.renderBoard();
  }

  removePiece(index) {
    const row = Math.floor(index / this.rows);
    const col = index % this.cols;
    this.board[row][col] = null;
    this.renderBoard();
  }

  renderBoard() {
    const boardList = this.displayBoard();
    const parent = document.querySelector(".board-wrap");
    parent.textContent = "";
    const colDivList = [];
    boardList.forEach((row, rowIndex) => {
      const rowDiv = lib.createDOM("div", null, { className: "board-row" });
      parent.appendChild(rowDiv);
      let i = 0;

      row.forEach((col, colIndex) => {
        const colWrap = lib.createDOM("div", "", {
          className: "board-col-item-wrap",
        });
        const colDiv = lib.createDOM("div", col?.name, {
          className: "board-col-item",
        });
        colDiv.setAttribute("draggable", !!col);
        if (col) {
          const pieceIndex = rowIndex * 3 + colIndex;
          col.drag(colDiv, "board", pieceIndex, this, this.User);
        }

        colWrap.appendChild(colDiv);
        colDivList.push(colWrap);
        rowDiv.appendChild(colWrap);
      });
    });
    // promise
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