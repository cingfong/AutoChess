import Chess from "./chess.js";
import stageData from "./stageData.json" assert { type: "json" };
import lib from "./lib.js";
class stage {
  constructor() {
    this.User = null;
    this.stageData = stageData;
    this.level = 1;
  }

  clearance() {
    this.level = this.level + 1;
  }
  setUserObject(User) {
    this.User = User;
  }
  getStageData() {
    const _nowStageData = this.stageData[`level${this.level}`];
    _nowStageData.chessList.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === null) return;
        const { race, level } = col;
        _nowStageData.chessList[rowIndex][colIndex] = new Chess(race, level);
      });
    });
    return _nowStageData;
  }

  renderBoard() {
    const arrFristLastCheange = (arr) => {
      const _arr = arr.slice();
      const first = _arr.shift();
      const last = _arr.pop();
      return [last, ..._arr, first];
    };
    const userBoardList = this.User.getBoard();
    const stageBoardList = this.getStageData().chessList;
    // 順序調換，關卡棋子佈局與遊戲戰鬥剛好相反
    const renderStageBoardList = arrFristLastCheange(stageBoardList);
    const userBoardWrap = document.querySelector(".user-board-wrap");
    const computeBoardWrap = document.querySelector(".compute-board-wrap");
    userBoardWrap.textContent = "";
    computeBoardWrap.textContent = "";
    userBoardList.forEach((row, rowIndex) => {
      const rowDiv = lib.createDOM("div", null, {
        className: "user-board-row",
      });
      userBoardWrap.appendChild(rowDiv);
      let i = 0;

      row.forEach((col, colIndex) => {
        const colWrap = lib.createDOM("div", "", {
          className: "user-board-col-item-wrap",
        });
        const colDiv = lib.createDOM("div", col?.chname, {
          className: "user-board-col-item",
        });

        colWrap.appendChild(colDiv);
        rowDiv.appendChild(colWrap);
      });
    });

    renderStageBoardList.forEach((row, rowIndex) => {
      const rowDiv = lib.createDOM("div", null, {
        className: "compute-board-row",
      });
      computeBoardWrap.appendChild(rowDiv);
      let i = 0;

      row.forEach((col, colIndex) => {
        const colWrap = lib.createDOM("div", "", {
          className: "compute-board-col-item-wrap",
        });
        const colDiv = lib.createDOM("div", col?.chname, {
          className: "compute-board-col-item",
        });

        colWrap.appendChild(colDiv);
        rowDiv.appendChild(colWrap);
      });
    });
  }

  fight() {
    const _this = this;
    const userBoardList = this.User.getBoard();
    const stageBoardList = this.getStageData().chessList;
    const userBoardIterator = userBoardList[Symbol.iterator]();
    const stageBoardIterator = stageBoardList[Symbol.iterator]();
    let userRowIndex = -1;
    let stageRowIndex = -1;
    const getNowRowChess = (type, arriIerator) => {
      const _item = arriIerator.next();
      // 二次遍歷
      if (_item.done) {
        if (type === "user") {
          userRowIndex = -1;
          // return getNowRowChess("user", userBoardList[Symbol.iterator]());
        } else {
          stageRowIndex = -1;
          // return getNowRowChess("stage", stageBoardList[Symbol.iterator]());
        }
      }
      if (type === "user") userRowIndex++;
      else stageRowIndex++;
      if (_item.value || _item.done) return _item;
      return getNowRowChess(type, arriIerator);
    };
    function fightForeach(type) {
      let winner = null;
      if (winner) return winner;
      let attacker, receiver;
      if (type === "user") {
        attacker = "user";
        receiver = "stage";
      } else {
        attacker = "stage";
        receiver = "user";
      }
      const attackerChessList = getNowRowChess(
        attacker,
        eval(`${attacker}BoardIterator`)
      ).value;
      attackerChessList.forEach((attackChess, colIndex) => {
        if (!attackChess) return;
        // const attackRowIndex = eval(`${type}RowIndex`);
        const receiverChess = _this.getEnemyChess(attacker, colIndex);
        attackChess.attackPiece(receiverChess);
      });
      // 輪流攻擊
      fightForeach(receiver);
    }
    // 由玩家先攻擊
    // console.log(this.getStageData());
    return fightForeach("user");
  }

  getEnemyChess(type, index) {
    let enemyChessList, orderIndex;
    if (type === "user") enemyChessList = this.getStageData().chessList;
    else enemyChessList = this.User.getBoard();
    switch (index) {
      case 0:
        orderIndex = [0, 1, 2];
        break;
      case 1:
        orderIndex = [1, 2, 0];
        break;
      case 2:
        orderIndex = [2, 1, 0];
        break;
    }
    let enemyChess;
    enemyChessList.some((rowList) => {
      return orderIndex.some((index) => {
        if (!rowList[index]) return false;
        enemyChess = rowList[index];
        return true;
      });
    });
    return enemyChess;
  }
}
export default stage;
