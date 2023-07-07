export default {
  async delay(duration) {
    return new Promise((resolve) => setTimeout(resolve, duration));
  },
  appendAttack(attack, receive, callBack) {
    callBack(attack, receive);
  },
  async addAttack(chess, ourChessList, enemyChessList, callBack) {
    const ourList = ourChessList.flat();
    this.animation(chess, chess, 1);
    ourList.forEach((e) => {
      if (!e) return;
      if (this.support.includes(e.race)) return;
      if (!e.health) return;
      if (e.fightAddition?.attack?.level >= 4) return;
      this.animation(e, chess, 0);
      const chessAttack = e.attack;
      const chessAddition = e.fightAddition?.attack?.val || 0;
      const chessAdditionLevel = e.fightAddition?.attack?.level
        ? e.fightAddition?.attack?.level + 1
        : 1;
      const additionPercent = [0, 0.15, 0.3, 0.5][chess.level];
      const chessBattleSkill = e.element.querySelector(
        ".borard-col-batle-skill"
      );
      const additionAttack = Math.round(
        (chessAttack + chessAddition) * additionPercent
      );
      e.setFightAddition({
        addAttack: additionAttack,
        type: "attack",
        items: chessAdditionLevel,
      });
      chessBattleSkill.style.backgroundImage = `url('./static/attack-icon-${chessAdditionLevel}.png')`;
    });
    await this.delay(1000);
  },
  async anyTreat(chess, ourChessList, enemyChessList, callBack) {
    const ourList = ourChessList.flat();
    this.animation(chess, chess, 1);
    ourList.forEach((e) => {
      if (!e) return;
      if (this.support.includes(e.race)) return;
      if (!e.health) return;
      this.animation(e, chess, 0);
      const fullHealth = e.fullHealth;
      const health = e.health;
      const treatPercent = [0, 0.15, 0.3, 0.5][chess.level];
      const treat = Math.floor((fullHealth - health) * treatPercent);
      e.restore(treat);
    });
    await this.delay(1000);
  },
  async animation(boardItem, chess, backgroundIndex) {
    const itemChildElement = boardItem.element;
    const itemBuffElement = itemChildElement.querySelector(
      ".board-col-item-buff"
    );
    itemBuffElement.style.backgroundImage = `url('./static/${chess.effect[backgroundIndex]}.png')`;
    itemBuffElement.style.height = "100%";

    setTimeout(() => {
      itemBuffElement.style.height = "0%";
    }, 500);
  },
  anyAttck: ["appendAttack"],
  anyAssist: ["addAttack", "anyTreat"],
  support: ["medic", "drummer", "ninja"],
};
