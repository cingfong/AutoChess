class ChessStore {
    constructor(level) {
        // this.level = level; // 商店等級
        this.stock = []; // 商品庫存
    }

    // 升級商店
    upgrade() {
        this.level++;
    }

    // 隨機生成商品庫存
    generateStock() {
        const races = ["cavalry", "shield", "spearman", "archer", "handCannoneer", "horseArcher"];
        this.stock = [];
        for (let i = 0; i < 5; i++) { // 每次生成五種商品
            const race = races[Math.floor(Math.random() * races.length)];
            this.stock.push(race);
        }
    }

    // 展示商品庫存
    displayStock() {
        // this.stock.forEach((piece, index) => {
        //     console.log(`[${index + 1}] ${piece.name} (Race: ${piece.race}, Attack: ${piece.attack}, Health: ${piece.health}, Effect: ${piece.effect})`);
        // });
        return this.stock
    }

    // 購買商品
    purchase(index) {
        if (index < 1 || index > 5) {
            console.log("Invalid index.");
            return;
        }

        const piece = this.stock[index - 1];
        console.log(`You purchased ${piece.name}.`);
        this.stock.splice(index - 1, 1); // 從庫存中移除已購買的商品
        return piece;
    }
}
export default ChessStore
// 創建一個商店
// const store = new ChessStore(1);

// 升級商店
// store.upgrade();

// 生成商品庫存
// store.generateStock();

// 展示商品庫存
// store.displayStock();

// 購買商品
// const purchasedPiece = store.purchase(2);

// 再次展示商品庫存
// store.displayStock();
