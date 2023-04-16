class ChessStore {
    constructor(level) {
        this.level = level; // 商店等級
        this.stock = []; // 商品庫存
    }

    // 升級商店
    upgrade() {
        this.level++;
    }

    // 隨機生成商品庫存
    generateStock() {
        const races = ["Human", "Orc", "Elf", "Undead", "Dwarf"]; // 可供選擇的種族
        const effects = ["None", "Stun", "Poison", "Silence", "Burn"]; // 可供選擇的效果
        const minAttack = 20 + (this.level - 1) * 5; // 最小攻擊力，隨商店等級增加而增加
        const maxAttack = 40 + (this.level - 1) * 5; // 最大攻擊力，隨商店等級增加而增加
        const minHealth = 50 + (this.level - 1) * 10; // 最小血量，隨商店等級增加而增加
        const maxHealth = 100 + (this.level - 1) * 10; // 最大血量，隨商店等級增加而增加

        this.stock = [];
        for (let i = 0; i < 5; i++) { // 每次生成五種商品
            const race = races[Math.floor(Math.random() * races.length)];
            const effect = effects[Math.floor(Math.random() * effects.length)];
            const attack = Math.floor(Math.random() * (maxAttack - minAttack + 1)) + minAttack;
            const health = Math.floor(Math.random() * (maxHealth - minHealth + 1)) + minHealth;
            const piece = new ChessPiece(`Piece ${i + 1}`, race, attack, health, effect);
            this.stock.push(piece);
        }
    }

    // 展示商品庫存
    displayStock() {
        console.log("Current stock:");
        this.stock.forEach((piece, index) => {
            console.log(`[${index + 1}] ${piece.name} (Race: ${piece.race}, Attack: ${piece.attack}, Health: ${piece.health}, Effect: ${piece.effect})`);
        });
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

// 創建一個商店
const store = new ChessStore(1);

// 升級商店
store.upgrade();

// 生成商品庫存
store.generateStock();

// 展示商品庫存
store.displayStock();

// 購買商品
const purchasedPiece = store.purchase(2);

// 再次展示商品庫存
store.displayStock();
