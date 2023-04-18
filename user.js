class Player {
    constructor() {
        this.maxPieces = maxPieces || 5; // 最大棋子數量
        this.money = money || 20; // 玩家擁有的金額
        this.health = health || 100; // 玩家的血量
        this.pieces = new Array(9); // 玩家擁有的棋子
        this.pieces.fill(null);
    }

    // 新增一個棋子
    addPiece(piece) {
        if (this.pieces.length >= this.maxPieces) {
            console.log("You have reached the maximum number of pieces.");
            return;
        }

        this.pieces.push(piece);
        console.log(`${piece.name} has been added to your pieces.`);
    }

    // 移除一個棋子
    sellPiece(piece) {
        const index = this.pieces.indexOf(piece);
        if (index === -1) {
            console.log("You do not have this piece.");
            return;
        }

        this.pieces.splice(index, 1);
        console.log(`${piece.name} has been removed from your pieces.`);
    }

    // 顯示玩家擁有的棋子
    displayPieces() {
        console.log("Current pieces:");
        this.pieces.forEach((piece, index) => {
            console.log(`[${index + 1}] ${piece.name} (Race: ${piece.race}, Attack: ${piece.attack}, Health: ${piece.health}, Effect: ${piece.effect})`);
        });
    }
}

// 創建一個玩家
const player = new Player(8, 100, 1000);

// 新增一個棋子
const piece1 = new ChessPiece("Piece 1", "Human", 30, 80, "Stun");
player.addPiece(piece1);

// 顯示玩家擁有的棋子
player.displayPieces();

// 新增一個棋子
const piece2 = new ChessPiece("Piece 2", "Elf", 35, 90, "Silence");
player.addPiece(piece2);

// 顯示玩家擁有的棋子
player.displayPieces();

// 移除一個棋子
player.removePiece(piece1);

// 顯示玩家擁有的棋子
player.displayPieces();
