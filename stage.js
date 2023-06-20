import Chess from "./chess.js";
import stageDataList from "./stageData.json" assert { type: "json" };
import lib from "./lib.js";
import chessSkill from "./chessSkill.js";
class stage {
  constructor() {
    this.User = null;
    this.stageDataList = stageDataList;
    this.nowStage = null;
    this.level = 1;
    this.speedLsit = [1, 2, 3];
    this.speedIndex = 0;
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
    let ninjaIndex = 1;
    userBoardList.forEach((row, rowIndex) => {
      const rowDiv = lib.createDOM("div", null, {
        className: "user-board-row",
      });
      userBoardWrap.appendChild(rowDiv);

      let ninjaIndex = 1;
      row.forEach((col, colIndex) => {
        const colWrap = lib.createDOM("div", "", {
          className: "user-board-col-item-wrap",
        });
        const colDiv = lib.createDOM("div", "", {
          className: "user-board-col-item",
        });
        const colAttack = lib.createDOM("div", "", {
          className:
            "user-board-col-item-attack-wrap board-col-item-attack-wrap",
        });
        const colAttack2 = lib.createDOM("div", "", {
          className:
            "user-board-col-item-attack-wrap board-col-item-attack-wrap",
        });
        colAttack.style.backgroundImage = `url('./static/${col?.effect[0]}.png')`;
        colAttack2.style.backgroundImage = `url('./static/${col?.effect[1]}.png')`;
        if (col?.race === "ninja") {
          const _effectName = col.effect[0];
          const _newEffectName = _effectName.slice(0, -1) + ninjaIndex;
          colAttack.style.backgroundImage = `url('./static/${_newEffectName}.png')`;
          ninjaIndex++;
        }
        const colSpan = lib.createDOM("span", col?.chname, {});
        const colDivBackground = lib.createDOM("div", "", {
          className: "user-board-col-item-background",
        });
        const colDivBuffBackground = lib.createDOM("div", "", {
          className: "user-board-col-item-buff board-col-item-buff",
        });
        if (col) {
          col.setBackgroundElement(colDivBackground);
          col.setElement(colDiv);
        }

        colDiv.appendChild(colDivBuffBackground);
        colDiv.appendChild(colAttack);
        colDiv.appendChild(colAttack2);
        colDiv.appendChild(colSpan);
        colDiv.appendChild(colDivBackground);
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
        const colDiv = lib.createDOM("div", "", {
          className: "compute-board-col-item",
        });
        const colAttack = lib.createDOM("div", "", {
          className:
            "compute-board-col-item-attack-wrap board-col-item-attack-wrap",
        });
        const colAttack2 = lib.createDOM("div", "", {
          className:
            "compute-board-col-item-attack-wrap board-col-item-attack-wrap",
        });
        colAttack.style.backgroundImage = `url('./static/${col?.effect[0]}.png')`;
        colAttack2.style.backgroundImage = `url('./static/${col?.effect[1]}.png')`;
        if (col?.race === "ninja") {
          const _effectName = col.effect[0];
          const _effectBackground = _effectName.slice(0, -1) + ninjaIndex;
          colAttack.style.backgroundImage = `url('./static/${_effectBackground}.png')`;
          ninjaIndex++;
        }
        const colSpan = lib.createDOM("span", col?.chname, {});
        const colDivBackground = lib.createDOM("div", "", {
          className: "compute-board-col-item-background",
        });
        const colDivBuffBackground = lib.createDOM("div", "", {
          className: "compute-board-col-item-buff board-col-item-buff",
        });
        if (col) {
          col.setBackgroundElement(colDivBackground);
          col.setElement(colDiv);
        }

        colDiv.appendChild(colDivBuffBackground);
        colDiv.appendChild(colAttack);
        colDiv.appendChild(colAttack2);
        colDiv.appendChild(colSpan);
        colDiv.appendChild(colDivBackground);

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
      async function delay(duration) {
        return new Promise((resolve) => setTimeout(resolve, duration));
      }
      const attackerChessList = getNowRowChess(
        attacker,
        eval(`${attacker}BoardIterator`)
      ).value;
      const receiverBoardList = eval(`${receiver}BoardList`);
      for (const [colIndex, attackChess] of attackerChessList.entries()) {
        if (!attackChess || !attackChess.health || winner) continue;
        await delay(10);
        // 特殊技能直接調過攻擊
        if (chessSkill.anyAttck.includes(attackChess.skill)) continue;
        // 輔助技能
        if (chessSkill.anyAssist.includes(attackChess.skill)) {
          const attackChessSkill = attackChess.skill;
          const receiverChessList = eval(`${attacker}BoardList`);
          await chessSkill[attackChessSkill](attackChess, receiverChessList);
          continue;
        }
        const receiverChess = _this.getEnemyChess(attacker, colIndex);

        // 判斷每次攻擊技能
        const attackChessList = eval(`${attacker}BoardList`)
          .flat()
          .filter((e) => e !== null);
        const _chessAnyAttackSkill = attackChessList.filter(
          (e) => chessSkill.anyAttck.includes(e.skill) && e.health
        );
        // 攻擊追加動畫
        if (_chessAnyAttackSkill.length) {
          const _chessSkillIterator = _chessAnyAttackSkill.values();
          let _chessSkillitem = _chessSkillIterator.next();
          while (!_chessSkillitem.done) {
            const chessItem = _chessSkillitem.value;
            const skillAnimationRequest = {
              attack: chessItem,
              receive: receiverChess,
              type: attacker,
              callBack: () => {
                if (receiverChess.health) chessItem.attackPiece(receiverChess);
              },
            };
            setTimeout(() => {
              attackAnimation(skillAnimationRequest);
            }, 500);
            _chessSkillitem = _chessSkillIterator.next();
          }
        }

        // 一般攻擊
        const chessAnimationRequest = {
          attack: attackChess,
          receive: receiverChess,
          type: attacker,
          callBack: () => {
            attackChess.attackPiece(receiverChess);
          },
          delayTime: _chessAnyAttackSkill.length ? 500 : 0,
        };
        await attackAnimation(chessAnimationRequest);

        const receiverChessSurvive = receiverBoardList
          .flat()
          .some((e) => e?.health);
        if (!receiverChessSurvive) {
          winner = attacker;
        }
      }
      async function attackAnimation(configure) {
        const { attack, receive, type, callBack, delayTime = 0 } = configure;
        const attackChess = attack.element;
        const attackOriginLeft = attackChess.offsetLeft;
        const attackOriginTop = attackChess.offsetTop;
        const receiveChess = receive.element;
        const receiveChessLeft = receiveChess.offsetLeft;
        const receiveChessTop = receiveChess.offsetTop;
        const typeHeight = type === "user" ? 60 : -60;
        attackChess.style.position = "fixed";
        receiveChess.style.position = "fixed";
        function animation1() {
          return new Promise((resolve, reject) => {
            attack.element.style.left = `${attackOriginLeft}px`;
            attack.element.style.top = `${attackOriginTop}px`;
            attackChess.classList.remove("revice-move-chess");
            attackChess.classList.add("attack-move-chess");
            const chessPosition = {
              left: receiveChessLeft,
              top: receiveChessTop + typeHeight,
            };
            chessMove(attack, 1000, chessPosition);
            setTimeout(() => {
              resolve();
            }, 1000 + delayTime);
          });
        }
        function animation2() {
          return new Promise((resolve, reject) => {
            const receiveEffect = type === "user" ? -10 : 10;
            attackChess.classList.remove("attack-move-chess");
            receiveChess.classList.add("revice-move-chess");
            receiveChess.style.top = `${receiveChessTop + receiveEffect}px`;
            const attackChessEffect = attackChess.getElementsByClassName(
              "board-col-item-attack-wrap"
            )[0];
            const attackChessEffect2 = attackChess.getElementsByClassName(
              "board-col-item-attack-wrap"
            )[1];
            attackChessEffect.style.opacity = "1";
            attackChessEffect.style.height = "100%";
            if (attack.counter.includes(receive.race)) {
              setTimeout(() => {
                attackChessEffect2.style.opacity = "1";
                attackChessEffect2.style.height = "100%";
              }, 100);
            }
            setTimeout(() => {
              callBack();
            }, 200);
            setTimeout(() => {
              attackChessEffect.style.opacity = "0";
              attackChessEffect.style.height = "0%";
              attackChessEffect2.style.opacity = "0";
              attackChessEffect2.style.height = "0%";
              resolve();
            }, 500);
          });
        }
        function animation3() {
          return new Promise((resolve, reject) => {
            receiveChess.style.top = `${receiveChessTop}px`;
            setTimeout(() => {
              resolve();
            }, 500);
          });
        }
        function animation4() {
          return new Promise((resolve, reject) => {
            const chessPosition = {
              left: attackOriginLeft,
              top: attackOriginTop,
            };
            chessMove(attack, 1000, chessPosition);
            attackChess.classList.remove("revice-move-chess");
            attackChess.classList.add("attack-move-chess");
            setTimeout(() => {
              resolve();
            }, 1000);
          });
        }
        function animation5() {
          return new Promise((resolve, reject) => {
            attackChess.parentNode.style.zIndex = 1;
            setTimeout(() => {
              resolve();
            }, 10);
          });
        }
        await animation1();
        await animation2();
        await animation3();
        await animation4();
        await animation5();
      }
      function chessMove(chess, time, position) {
        const { left: endLeft, top: endTop } = position;
        const chessLeft = chess.element.offsetLeft;
        const chessTop = chess.element.offsetTop;
        let timeSplit = (time / 1000) * 60;
        if (chess.race === "ninja") {
          chess.element.parentNode.style.zIndex = 2;
        } else {
          chess.element.parentNode.style.zIndex = 3;
        }
        chess.element.style.left = `${endLeft}px`;
        chess.element.style.top = `${endTop}px`;
      }
      // 輪流攻擊
      if (!winner) {
        return fightForeach(receiver);
      } else {
        return { winner, money: this.nowStage.money };
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
