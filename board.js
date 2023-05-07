import lib from './lib.js';
class Board {
    constructor(rows, cols) {
        this.rows = rows || 3;
        this.cols = cols || 3;
        this.board = this.createBoard();
        this.colDivScope = []
        this.renderBoard()
    }

    // 創建棋盤
    createBoard() {
        const board = new Array(this.rows)
        for (let i = 0; i < this.rows; i++) {
            board[i] = new Array(this.cols).fill(null)
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
        this.renderBoard()
    }

    renderBoard() {
        const boardList = this.displayBoard()
        const parent = document.querySelector('.board-wrap')
        const _colDivScope = this.colDivScope
        _colDivScope.length = 0
        parent.textContent = ''
        const colDivList = []
        boardList.forEach(row => {
            const rowDiv = lib.createDOM('div', null, { className: 'board-row' })
            parent.appendChild(rowDiv)
            row.forEach(col => {
                const colDiv = lib.createDOM('div', col?.name, { className: 'board-col' })
                colDivList.push(colDiv)
                rowDiv.appendChild(colDiv)
            })
        })
        // promise
        setTimeout(() => {
            // 元素插入完才可以抓到元素範圍
            colDivList.forEach(item => {
                const { left, right, top, bottom } = item.getBoundingClientRect()
                _colDivScope.push({ left: left - 15, right: right + 15, top: top - 15, bottom: bottom + 15 })
            })
        })
    }

    getColDivScope() {
        return this.colDivScope
    }
}

export default Board
// const board = new ChessBoard();

// console.log(board)

// 清空棋盤
// board.clearBoard();