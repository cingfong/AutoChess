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
    const userBoardListFlat = userBoardList.flat();
    const stageBoardList = this.getStageData().chessList;
    const stageBoardListFlat = stageBoardList.flat();

    const userChessIterator = userBoardListFlat[Symbol.iterator]();
    const stageChessIterator = stageBoardListFlat[Symbol.iterator]();
    let userChessIndex = -1;
    let stageChessIndex = -1;
    function fightForeach() {
      let battleOverCtl = false;
      let winner = null;
      if (battleOverCtl) return winner;
      const getNowUserChess = (type, arriIerator) => {
        const _item = arriIerator.next();
        if (type === "user") userChessIndex++;
        else stageChessIndex++;

        if (_item.value || _item.done) return _item;
        return getNowUserChess(type, arriIerator);
      };
      const nowUserIterator = getNowUserChess("user", userChessIterator);
      const nowStageIterator = getNowUserChess("stage", stageChessIterator);
      // const nowUserIterator = userChessIterator.next();
      // const nowStageIterator = stageChessIterator.next();
      // const nowUserChessFight = nowUserIterator.value;
      // const nowStageChessFight = nowStageIterator.value;
      if (nowUserIterator.done && nowUserIterator.done) {
        // return fightForeach();
      } else {
        console.log(userChessIndex);
        console.log(_this.getEnemyChess("user", userChessIndex));
      }
    }
    return fightForeach();
  }

  getEnemyChess(type, index) {
    let enemyChessList, traverseIndex;
    if (type === "user") enemyChessList = this.getStageData().chessList;
    else enemyChessList = this.User.getBoard();
    switch (index) {
      case 0:
        traverseIndex = [0, 1, 2];
        break;
      case 1:
        traverseIndex = [1, 2, 0];
        break;
      case 2:
        traverseIndex = [2, 1, 0];
        break;
    }
    return enemyChessList.find((e, i) => {
      return traverseIndex.find((traverse) => {
        console.log(e[traverse] ? true : false);
        if (e[traverse]) return true;
        return false;
      });
    });
  }
}
export default stage;
