import Chess from "./chess.js";
import stageDataList from "./stageData.json" assert { type: "json" };
import lib from "./lib.js";
class stage {
  constructor() {
    this.User = null;
    this.stageDataList = stageDataList;
    this.nowStage = null;
    this.level = 1;
    this.getStageData();
  }

  clearance() {
    this.level = this.level + 1;
  }
  setUserObject(User) {
    this.User = User;
  }

  getStageData() {
    const _nowStageData = this.stageDataList[`level${this.level}`];
    _nowStageData.chessList.forEach((row, rowIndex) => {
      row.forEach((col, colIndex) => {
        if (col === null) return;
        const { race, level } = col;
        _nowStageData.chessList[rowIndex][colIndex] = new Chess(race, level);
      });
    });
    this.nowStage = _nowStageData;
  }

  renderBoard() {
    const arrFristLastCheange = (arr) => {
      const _arr = arr.slice();
      const first = _arr.shift();
      const last = _arr.pop();
      return [last, ..._arr, first];
    };
    const userBoardList = this.User.getBoard();
    const stageBoardList = this.nowStage.chessList;
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
        const colDivBackgound = lib.createDOM("div", "", {
          className: "user-board-col-item-background",
        });
        if (col) {
          col.setElement(colDivBackgound);
        }

        colDiv.appendChild(colDivBackgound);
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
        const colDivBackgound = lib.createDOM("div", "", {
          className: "compute-board-col-item-background",
        });
        if (col) {
          col.setElement(colDivBackgound);
        }

        colDiv.appendChild(colDivBackgound);

        colWrap.appendChild(colDiv);
        rowDiv.appendChild(colWrap);
      });
    });
  }

  fight() {
    const _this = this;
    const userBoardList = this.User.getBoard();
    const stageBoardList = this.nowStage.chessList;
    let userBoardIterator = userBoardList.values();
    let stageBoardIterator = stageBoardList.values();
    let userRowIndex = -1;
    let stageRowIndex = -1;
    const getNowRowChess = (type, arriIerator) => {
      const _item = arriIerator.next();
      // 二次遍歷
      if (_item.done) {
        if (type === "user") {
          userRowIndex = -1;
          userBoardIterator = userBoardList.values();
          return getNowRowChess("user", userBoardIterator);
        } else {
          stageRowIndex = -1;
          stageBoardIterator = stageBoardList.values();
          return getNowRowChess("stage", stageBoardIterator);
        }
      }
      if (type === "user") userRowIndex++;
      else stageRowIndex++;
      if (_item.value && !_item.done) return _item;
    };
    async function fightForeach(type) {
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
      const receiverBoardList = eval(`${receiver}BoardList`);
      for (const [colIndex, attackChess] of attackerChessList.entries()) {
        if (!attackChess || !attackChess.health || winner) continue;
        await delay(1000);
        const receiverChess = _this.getEnemyChess(attacker, colIndex);
        attackChess.attackPiece(receiverChess);
        const receiverChessSurvive = receiverBoardList
          .flat()
          .some((e) => e?.health);
        if (!receiverChessSurvive) {
          winner = attacker;
        }
      }
      async function delay(duration) {
        return new Promise((resolve) => setTimeout(resolve, duration));
      }
      // 輪流攻擊
      if (!winner) {
        return fightForeach(receiver);
      } else {
        return winner;
      }
    }
    // 由玩家先攻擊
    return fightForeach("user");
  }

  getEnemyChess(type, index) {
    let enemyChessList, orderIndex;
    if (type === "user") enemyChessList = this.nowStage.chessList;
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
        if (!rowList[index].health) return false;
        enemyChess = rowList[index];
        return true;
      });
    });
    return enemyChess;
  }
}
export default stage;
