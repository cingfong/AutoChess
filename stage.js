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
    const userBoardList = this.User.getBoard();
    const stageBoardList = this.getStageData().chessList;
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

    stageBoardList.forEach((row, rowIndex) => {
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
}
export default stage;
