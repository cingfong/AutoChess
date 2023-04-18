class ChessBoard {
    constructor(rows, cols) {
        this.rows = rows || 3;
        this.cols = cols || 3;
        this.board = this.createBoard();
    }

    // 創建棋盤
    createBoard() {
        const board = new Array(this.rows)
        for (let i = 0; i < this.rows; i++) {
            board[i] = new Array(this.cols)
        }
        return board;
    }

    displayBoard() {
        return this.board
    }

    // 設置棋子
    setPiece(row, col, piece) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            throw new Error("Invalid position");
        }
        this.board[row][col] = piece;
    }
}

export default ChessBoard
// const board = new ChessBoard();

// console.log(board)

// 清空棋盤
// board.clearBoard();