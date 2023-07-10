import Chess from "./chess.js";
import lib from "./lib.js";
import utils from "./utils.js";
class ChessStore {
  constructor(level = 1) {
    this.level = level; // 商店等級
    this.stock = []; // 商品庫存
    this.oldStock = [];
    this.generateStock();
    this.User = null;
    this.display = true;
    this.storeScope = null;
    this.firstLoad = false;
  }

  // 升級商店
  upgrade() {
    this.level++;
  }
  hidden() {
    const shopWrap = document.querySelector(".shop-wrap");
    shopWrap.style.display = "none";
    this.display = false;
  }
  show() {
    const shopWrap = document.querySelector(".shop-wrap");
    shopWrap.style.display = "flex";
    this.display = true;
  }

  getDisplay() {
    return this.display;
  }

  // 隨機生成商品庫存
  generateStock() {
    const racesList = [
      ["cavalry"],
      ["archer", "handCannoneer", "horseArcher"],
      ["ninja", "drummer", "medic"],
    ];
    const shopLength = this.level > 1 ? 10 : 5;
    const races = [];
    for (let i = 0; i < this.level; i++) {
      races.push(...racesList[i]);
    }
    this.stock = [];
    for (let i = 0; i < shopLength; i++) {
      // 每次生成五種商品
      const race = races[Math.floor(Math.random() * races.length)];
      const piece = new Chess(race);
      // 旗子金額
      this.stock.push(piece);
    }
  }

  // 展示商品庫存
  displayStock() {
    return this.stock;
  }

  // 購買商品
  purchase(index) {
    if (index < 0) {
      console.log("Invalid index.");
      return;
    }
    // 判斷玩家金額
    const _user = this.User;
    const _userMoney = _user.getMoney();
    const _userMaxPieces = _user.maxPieces;
    const _userPieceLength = _user.displayPiecesLength();
    const _chess = this.stock[index];
    const _chessMoney = _chess.price;
    if (!_chess) return;
    if (_userMoney < _chessMoney) {
      utils
        .popUps({
          type: "fail",
          title: "提醒",
          content: "玩家金額不足",
        })
        .then((v) => {
          const fightWrap = document.querySelector(".fight-wrap");
          fightWrap.classList.add("hidden");
        });
      return;
    }
    if (_userMaxPieces <= _userPieceLength) {
      utils
        .popUps({
          type: "fail",
          title: "提醒",
          content: "棋子已滿",
        })
        .then((v) => {
          const fightWrap = document.querySelector(".fight-wrap");
          fightWrap.classList.add("hidden");
        });
      return;
    }
    const piece = this.stock.splice(index, 1, "")[0]; // 從庫存中移除已購買的商品
    _user.buyPiece(piece);
    this.renderShop();
    return piece;
  }

  refresh() {
    const refreshMoney = 10;
    const _user = this.User;
    const _userMoney = _user.getMoney();
    if (_userMoney < refreshMoney) {
      utils
        .popUps({
          type: "fail",
          title: "提醒",
          content: "玩家金額不足",
        })
        .then((v) => {
          const fightWrap = document.querySelector(".fight-wrap");
          fightWrap.classList.add("hidden");
        });
      return;
    }
    _user.reduceMoney(refreshMoney);
    this.generateStock();
    this.renderShop();
  }

  render() {
    this.renderShop();
  }

  getRenderIndex() {
    if (!this.stock.length) {
      this.stock = [null, null, null, null, null, null];
    }
    const _stock = this.stock;
    const _oldStock = this.oldStock;
    const renderIndexList = _stock.reduce((arr, item, index) => {
      if (item !== _oldStock[index]) {
        arr.push(index);
      }
      return arr;
    }, []);
    this.oldStock = this.stock.slice();
    return renderIndexList;
  }

  renderShop() {
    const _this = this;
    const reRenderIndexList = _this.getRenderIndex();
    const shopWrap = document.querySelector(".shop-wrap");
    const storeList = this.displayStock();
    const parent = document.querySelector(".shop-piece");
    const childList = parent.childNodes;
    reRenderIndexList.forEach((reRenderIndex) => {
      const item = storeList[reRenderIndex];
      const index = reRenderIndex;
      const childItem = childList[index];
      const chessWrap = lib.createDOM("div", "", {
        className: "chess-item-wrap",
      });
      const elementDiv = lib.createDOM("div", "", {
        className: "chess-item",
      });
      const elementImg = lib.createDOM("img", "", {
        src: `./static/user/${item?.name ?? "space"}.png`,
      });
      elementDiv.addEventListener("click", () => {
        _this.purchase(index);
      });
      elementDiv.appendChild(elementImg);
      chessWrap.appendChild(elementDiv);
      if (!childItem) {
        parent.appendChild(chessWrap);
      } else {
        parent.replaceChild(chessWrap, childItem);
      }
    });
    if (!this.firstLoad) {
      setTimeout(() => {
        const { left, right, top, bottom } = shopWrap.getBoundingClientRect();
        this.storeScope = {
          left: left - 15,
          right: right + 15,
          top: top - 15,
          bottom: bottom + 15,
        };
        this.shopAddEvent();
      });
      this.firstLoad = true;
    }
  }

  shopAddEvent() {
    const _this = this;
    const shopCloseBtn = document.querySelector(".shop-close");
    const shopShowBtn = document.querySelector(".shop-show-btn");
    const shopRefreshBtn = document.querySelector(".shop-refresh-btn");
    shopCloseBtn.onclick = null;
    shopShowBtn.onclick = null;
    shopRefreshBtn.onclick = null;
    shopCloseBtn.onclick = () => {
      _this.hidden();
    };
    shopShowBtn.onclick = () => {
      _this.show();
    };
    shopRefreshBtn.onclick = () => {
      _this.refresh();
    };
  }

  getScope() {
    return this.storeScope;
  }

  setUserObject(User) {
    this.User = User;
  }
}
export default ChessStore;
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
