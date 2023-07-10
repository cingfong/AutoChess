import lib from "./lib.js";
import chessDefaultList from "./chessList.js";
class ChessPiece {
  constructor(chessName, level) {
    const chess = chessDefaultList[chessName];
    this.level = level || 1;
    this.backgroundElement = null;
    this.element = null;
    Object.assign(this, chess);
    this.fullHealth = this.health;
    this.fightAddition = {};
    if (this.level > 1) {
      this.setBonus();
    }
  }
  // 攻擊對手棋子
  attackPiece(opponentPiece, moveSpeed) {
    const attackRandom = Math.floor(
      this.attack * ((Math.random(4) + 8) / 10),
      2
    );
    const getAddition = this.fightAddition?.attack?.val || 0;
    const attackAddition = attackRandom + getAddition;
    const _counterChess = this.getCounter();
    if (_counterChess.includes(opponentPiece.race)) {
      opponentPiece.health -= attackAddition * 2;
    } else {
      opponentPiece.health -= attackAddition;
    }
    if (opponentPiece.health <= 0) {
      opponentPiece.health = 0;
      setTimeout(() => {
        opponentPiece.element.classList.add(`dead-${moveSpeed}`);
      }, 1000 / moveSpeed);
    } else {
      console.log(
        `${this.name} attacked ${opponentPiece.name}. ${opponentPiece.name}'s health is now ${opponentPiece.health}.`
      );
    }
    opponentPiece.backgroundElement.style.height = `${
      (1 - opponentPiece.health / opponentPiece.fullHealth) * 100
    }%`;
  }
  restore(treat) {
    if (!this.health) return;
    this.health += treat;
    this.backgroundElement.style.height = `${
      (1 - this.health / this.fullHealth) * 100
    }%`;
  }

  setBackgroundElement(element) {
    this.backgroundElement = element;
  }

  setElement(element) {
    this.element = element;
  }

  // 獲取種族
  getRace() {
    return this.race;
  }

  // 獲取效果
  getCounter() {
    return this.counter;
  }

  getHealth() {
    return this.health;
  }

  getPrice() {
    const chessNum = 3 ** (this.level - 1);
    if (this.level === 1) return this.price;
    return this.price * 0.8 * chessNum;
  }
  setFightAddition({ val, type, items }) {
    if (!this.fightAddition[type]) this.fightAddition[type] = {};

    if (!Object.keys(this.fightAddition[type]).length) {
      this.fightAddition[type].val = val;
      this.fightAddition[type].level = 1;
      return;
    }
    this.fightAddition[type].val += val;
    this.fightAddition[type].level = items;
  }
  setBonus() {
    let defaultLevel = 1;
    while (defaultLevel <= this.level) {
      this.getBonus(defaultLevel);
      defaultLevel++;
    }
  }
  // 獲取加成
  getBonus(_level) {
    const levelBonusList = [1, 1.6, 1.5, 1.4, 1.3, 1.5];
    // 假設加成是攻擊力的 10%
    this.attack = Math.round(
      this.attack * levelBonusList[_level || this.level - 1]
    );
    this.health = Math.round(
      this.health * levelBonusList[_level || this.level - 1]
    );
    this.fullHealth = this.health;
  }
  levelUp() {
    this.level++;
    this.getBonus();
  }

  // 頁面事件
  drag(element, type, typeIndex, Board, User, Shop) {
    let touchCtl = false;
    element.addEventListener("dragstart", (event) => {
      if (touchCtl) return;
      const { offsetX, offsetY } = event;
      element.dataset.offsetX = offsetX;
      element.dataset.offsetY = offsetY;
    });
    element.addEventListener("drag", (event) => {
      if (touchCtl) return;
      playerPieceDragMove(event, element, "mouse");
    });
    element.addEventListener(
      "dragover",
      (event) => {
        event.preventDefault();
      },
      false
    );
    element.addEventListener("dragend", (event) => {
      if (touchCtl) return;
      playerPieceDragEnd(event, element, { Board, User, Shop, _this: this });
    });

    // touch 事件
    element.addEventListener("touchstart", function (event) {
      touchCtl = true;
      const rect = event.target.getBoundingClientRect();
      const offsetX = event.targetTouches[0].pageX - rect.left;
      const offsetY = event.targetTouches[0].pageY - rect.top;
      element.dataset.offsetX = offsetX;
      element.dataset.offsetY = offsetY;
    });
    element.addEventListener("touchmove", (event) => {
      playerPieceDragMove(event, element, "touch");
    });
    element.addEventListener("touchend", (event) => {
      touchCtl = false;
      playerPieceDragEnd(event, element, { Board, User, Shop, _this: this });
    });
    function playerPieceDragMove(mouse, element, type) {
      let mouseX, mouseY, elementShow;
      if (type === "mouse") {
        const { clientX, clientY } = mouse;
        mouseX = clientX;
        mouseY = clientY;
        elementShow = false;
      } else if (type === "touch") {
        const { pageX, pageY } = mouse.targetTouches[0];
        mouseX = pageX;
        mouseY = pageY;
        elementShow = true;
      }

      const { offsetX, offsetY } = element.dataset;
      const { offsetWidth, offsetHeight } = element;
      const touchLeft = mouseX - offsetX;
      const touchRight = mouseX + (offsetWidth - offsetX);
      const touchTop = mouseY - offsetY;
      const touchBottom = mouseY + (offsetHeight - offsetY);
      if (touchLeft < 0 || touchTop < 0) return;
      Object.assign(element.dataset, {
        touchLeft,
        touchRight,
        touchTop,
        touchBottom,
      });
      element.style.zIndex = 1;
      element.style.position = "fixed";
      element.style.opacity = 1;
      // element.style.opacity = elementShow ? 1 : 0;
      element.style.left = `${mouseX - offsetX}px`;
      element.style.top = `${mouseY - offsetY}px`;
    }
    function playerPieceDragEnd(event, element, _thisObject) {
      const { Board: _Board, Shop, User, _this } = _thisObject;
      // const _Board = Board;
      const { touchLeft, touchRight, touchTop, touchBottom } = element.dataset;
      // 旗子被賣掉
      // 待調整
      if (Shop && Shop.getDisplay()) {
        const {
          left: ShopLeft,
          right: ShopRight,
          top: ShopTop,
          bottom: SHopBottom,
        } = Shop.getScope();
        if (
          ShopTop <= touchTop &&
          ShopRight >= touchRight &&
          SHopBottom >= touchBottom &&
          ShopLeft <= touchLeft
        ) {
          User.removePiece(typeIndex);
          User.renderStoragePiece();
          const sellPrice = _this.getPrice();
          User.sellChess(sellPrice);
          return;
        }
      }
      // object
      const boardScopeList = _Board.getColDivScope();
      const boardIndex = boardScopeList.findIndex(
        (item) =>
          item.top <= touchTop &&
          item.right >= touchRight &&
          item.bottom >= touchBottom &&
          item.left <= touchLeft
      );
      const storageIndex = User.storageDivScope.findIndex(
        (item) =>
          item.top <= touchTop &&
          item.right >= touchRight &&
          item.bottom >= touchBottom &&
          item.left <= touchLeft
      );
      if (!~boardIndex && !~storageIndex) {
        element.style.position = "relative";
        element.style.zIndex = "1";
        element.style.left = "0";
        element.style.top = "0";
        return;
      }

      let oldPiece = null;
      if (~boardIndex) {
        const _oldIndex = type === "board" ? typeIndex : null;
        if (_oldIndex === boardIndex) {
          _Board.renderBoard();
          return;
        }
        oldPiece = _Board.setPiece(_oldIndex, boardIndex, _this);
      }
      if (~storageIndex) {
        const _oldIndex = type === "user" ? typeIndex : null;
        if (_oldIndex === storageIndex) {
          User.renderStoragePiece();
          return;
        }
        oldPiece = User.setPiece(_oldIndex, storageIndex, _this);
      }
      if (type === "user") User.removePiece(typeIndex);
      if (type === "board") _Board.removePiece(typeIndex);
      if (oldPiece) {
        if (type === "user") {
          User.setPiece(null, typeIndex, oldPiece);
        } else {
          _Board.setPiece(null, typeIndex, oldPiece);
        }
      }
    }
  }

  // getBoardScope() {
  //     return this.Board.getColDivScope()
  // }
}

export default ChessPiece;
// 創建一個自走棋棋子
// const piece = new ChessPiece(chessList[race]);

// 攻擊一個對手棋子
// const opponentPiece = new ChessPiece("Orc Warrior", "Orc", 30, 80, "None");
// piece.attackPiece(opponentPiece);
