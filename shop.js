import Chess from "./chess.js";
import lib from './lib.js';
class ChessStore {
    constructor(level) {
        // this.level = level; // 商店等級
        this.stock = []; // 商品庫存
        this.generateStock()
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
            // 旗子金額
            this.stock.push(race);
        }
    }

    // 展示商品庫存
    displayStock() {
        return this.stock
    }

    // 購買商品
    purchase(index) {
        if (index < 0 || index > 5) {
            console.log("Invalid index.");
            return;
        }
        // 判斷玩家金額
        const piece = this.stock.splice(index, 1, ''); // 從庫存中移除已購買的商品
        this.renderShop()
        return piece;
    }

    render() {
        this.renderShop()
    }

    renderShop() {
        const _this = this
        const storeList = this.displayStock()
        const parent = document.querySelector('.shop-wrap')
        parent.textContent = ''
        storeList.forEach((item, index) => {
            const ChessItem = new Chess(item)
            const chessWrap = lib.createDOM("div", "", {
                className: "chess-item-wrap",
            });
            const elementDiv = lib.createDOM('button', ChessItem.name, {
                className: 'chess-item'
            })
            elementDiv.addEventListener('click', () => {
                const _chess = _this.purchase(index)
            })
            chessWrap.appendChild(elementDiv)
            parent.appendChild(chessWrap)
        })
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
