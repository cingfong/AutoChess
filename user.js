import Board from './board.js'
import Chess from './chess.js'
import lib from './lib.js'
class User {
    constructor(maxPieces, money, health) {
        this.maxPieces = maxPieces || 6; // 最大棋子數量
        this.money = money || 20; // 玩家擁有的金額
        this.health = health || 100; // 玩家的血量
        this.storage = ['', '', '', '', '', '']; // 玩家擁有的棋子
        // this.storage = ['騎兵', '盾兵', '槍兵', '弓兵', '火槍兵', '弓騎兵']
        this.Board = new Board
        this.storageDivScope = []
        // 模擬事件
        this.testAddPiece()

        // 渲染
        this.renderStoragePiece()
    }
    testAddPiece() {
        const chess = new Chess('cavalry')
        this.addPiece(chess)
    }

    // 新增一個棋子
    addPiece(piece) {
        if (this.storage.length > this.maxPieces) {
            console.log("玩家棋子過多");
            return;
        }

        const addChessIndex = this.storage.findIndex(item => !item)
        this.storage[addChessIndex] = piece
        // console.log(`${piece.name} has been added to your pieces.`);
    }

    setPiece(oldIndex, index, piece) {
        const nextPiece = this.storage[index]
        if (!nextPiece) {
            this.storage[index] = piece
            this.storage[oldIndex] = ''
        } else {
            const oldPiece = {}
            Object.assign(oldPiece, nextPiece)
            this.storage[index] = piece
            this.storage[oldIndex] = oldPiece
        }
        this.renderStoragePiece()
    }

    // 移除一個棋子
    sellPiece(piece) {
        const index = this.storage.indexOf(piece);
        if (index === -1) {
            console.log("You do not have this piece.");
            return;
        }
        this.storage.splice(index, 1);
        // console.log(`${piece.name} has been removed from your pieces.`);
    }

    // 顯示玩家擁有的棋子
    displayPieces() {
        return this.storage
        // this.pieces.forEach((piece, index) => {
        //     console.log(`[${index + 1}] ${piece.name} (Race: ${piece.race}, Attack: ${piece.attack}, Health: ${piece.health}, Effect: ${piece.effect})`);
        // });
    }

    renderStoragePiece() {
        const storagePiece = this.displayPieces()
        const parent = document.querySelector('.user-piece-wrap')
        parent.textContent = ''
        const storeDivList = []
        storagePiece.forEach((piece, pieceIndex) => {
            const pieceWrap = lib.createDOM('div', '', { className: 'user-piece-item-wrap' })
            const pieceDiv = lib.createDOM('div', piece.name, { className: 'user-piece-item' })
            pieceDiv.setAttribute('draggable', !!piece.name)
            pieceDiv.addEventListener('drag', (event) => { playerPieceDrag(event, pieceDiv) })
            pieceDiv.addEventListener('dragstart', (event) => {
                const { offsetX, offsetY } = event
                pieceDiv.dataset.offsetX = offsetX
                pieceDiv.dataset.offsetY = offsetY
            })
            pieceDiv.addEventListener('dragover', (event) => {
                event.preventDefault()
            }, false)
            pieceDiv.addEventListener('dragend', (event) => {
                const _Board = this.Board
                const { touchLeft, touchRight, touchTop, touchBottom } = pieceDiv.dataset
                // object
                const boardScopeList = this.Board.getColDivScope()
                const boardIndex = boardScopeList.findIndex(item => item.top <= touchTop && item.right >= touchRight && item.bottom >= touchBottom && item.left <= touchLeft)
                const storageIndex = this.storageDivScope.findIndex(item => item.top <= touchTop && item.right >= touchRight && item.bottom >= touchBottom && item.left <= touchLeft)
                if (!~boardIndex && !~storageIndex) {
                    this.renderStoragePiece()
                    return
                }
                if (~boardIndex) {
                    const setPiceRow = Math.floor(boardIndex / 3)
                    const setPiceCol = boardIndex % 3
                    _Board.setPiece(setPiceRow, setPiceCol, piece)
                }
                if (~storageIndex) {
                    this.setPiece(pieceIndex, storageIndex, piece)
                }

            })
            pieceWrap.appendChild(pieceDiv)
            storeDivList.push(pieceWrap)
            parent.appendChild(pieceWrap)
        })
        setTimeout(() => {
            const _storageDivScope = this.storageDivScope
            _storageDivScope.length = 0
            // 元素插入完才可以抓到元素範圍
            storeDivList.forEach(item => {
                const { left, right, top, bottom } = item.getBoundingClientRect()
                _storageDivScope.push({ left: left - 15, right: right + 15, top: top - 15, bottom: bottom + 15 })
            })
        })

        function playerPieceDrag(mouse, element) {
            const { clientX: mouseX, clientY: mouseY } = mouse
            const { offsetX, offsetY } = element.dataset
            const { offsetWidth, offsetHeight } = element
            const touchLeft = mouseX - offsetX
            const touchRight = mouseX + (offsetWidth - offsetX)
            const touchTop = mouseY - offsetY
            const touchBottom = mouseY + (offsetHeight - offsetY)
            if (touchLeft < 0 || touchTop < 0) return
            Object.assign(element.dataset, { touchLeft, touchRight, touchTop, touchBottom })
            element.style.position = 'fixed'
            element.style.opacity = 0
            element.style.left = `${mouseX - offsetX}px`
            element.style.top = `${mouseY - offsetY}px`
        }
    }
}
export default User
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
