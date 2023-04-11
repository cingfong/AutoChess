class ChessBoard {
    constructor(rows, cols) {
        this.rows = rows || 3;
        this.cols = cols || 3;
        this.board = this.createBoard();
    }

    // 創建棋盤
    createBoard() {
        let board = new Array(this.rows);
        for (let i = 0; i < this.rows; i++) {
            board[i] = new Array(this.cols);
        }
        return board;
    }

    // 設置棋子
    setPiece(row, col, piece) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            throw new Error("Invalid position");
        }
        this.board[row][col] = piece;
    }

    // 獲取棋子
    getPiece(row, col) {
        if (row < 0 || row >= this.rows || col < 0 || col >= this.cols) {
            throw new Error("Invalid position");
        }
        return this.board[row][col];
    }

    // 清除棋盤
    clearBoard() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.cols; j++) {
                this.board[i][j] = null;
            }
        }
    }
}

// 創建一個 8x8 的棋盤
const board = new ChessBoard(8, 8);

// 設置棋子
board.setPiece(0, 0, "rook");
board.setPiece(0, 1, "knight");
board.setPiece(0, 2, "bishop");
board.setPiece(0, 3, "queen");
board.setPiece(0, 4, "king");
board.setPiece(0, 5, "bishop");
board.setPiece(0, 6, "knight");
board.setPiece(0, 7, "rook");

board.setPiece(1, 0, "pawn");
board.setPiece(1, 1, "pawn");
board.setPiece(1, 2, "pawn");
board.setPiece(1, 3, "pawn");
board.setPiece(1, 4, "pawn");
board.setPiece(1, 5, "pawn");
board.setPiece(1, 6, "pawn");
board.setPiece(1, 7, "pawn");

// 獲取棋子
console.log(board.getPiece(0, 0)); // Output: rook

// 清空棋盤
board.clearBoard();