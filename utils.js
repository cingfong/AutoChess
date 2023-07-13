export default {
  popUps: ({ type = "win", title, content, cancelBtn }) => {
    const typeClassList = ["win", "fail", "error", "success"];
    const typeClass = type;
    const resetClass = (dom) => {
      typeClassList.forEach((classItem) => {
        dom.classList.remove(classItem);
      });
    };
    return new Promise((resolve, reject) => {
      const wrap = document.querySelector(".pop-up-card");
      const titleDom = wrap.querySelector(".title");
      const contentDom = wrap.querySelector(".content");
      const buttonDom = wrap.querySelector(".button");
      const cancelButtonDom = wrap.querySelector(".cancel");
      if (cancelBtn) {
        cancelButtonDom.classList.remove("hidden");
      } else {
        cancelButtonDom.classList.add("hidden");
      }
      resetClass(wrap);
      resetClass(titleDom);
      resetClass(buttonDom);
      wrap.classList.add(typeClass);
      titleDom.classList.add(typeClass);
      buttonDom.classList.add(typeClass);
      titleDom.textContent = title;
      contentDom.textContent = content;
      const clickMethod = () => {
        wrap.classList.add("hidden");
        buttonDom.removeEventListener("click", clickMethod);
        resolve();
      };
      // 彈窗顯示
      if ([...wrap.classList].includes("hidden")) {
        wrap.classList.remove("hidden");
      }
      buttonDom.addEventListener("click", clickMethod);
      cancelButtonDom.addEventListener("click", () => {
        wrap.classList.add("hidden");
      });
    });
  },
  screenJudge() {
    const remindDom = document.querySelector(".screen-vertical");
    if (window.orientation == 180 || window.orientation == 0) {
      remindDom.classList.remove("flex");
      remindDom.classList.add("hidden");
    }
    if (window.orientation == 90 || window.orientation == -90) {
      remindDom.classList.remove("hidden");
      remindDom.classList.add("flex");
      window.requestAnimationFrame(() => this.screenJudge());
    }
  },
  questionAddEvent() {
    const questionShowBtn = document.querySelector(".question-show-btn");
    const questionCloseBtn = document.querySelector(".question-close-btn");
    const questionWrap = document.querySelector(".question-wrap");
    questionShowBtn.onclick = () => {
      questionWrap.classList.remove("hidden");
    };
    questionCloseBtn.onclick = () => {
      questionWrap.classList.add("hidden");
    };
  },
  fightBtnAddEvent() {
    const fightBtn = document.querySelector(".fight-show-btn");
    const fightWrap = document.querySelector(".fight-wrap");
    fightBtn.addEventListener("click", () => {
      if (
        !window._globalAutoChess.User.getBoard()
          .flat()
          .some((e) => e)
      ) {
        this.popUps({
          type: "error",
          title: "錯誤",
          content: "沒有任何棋子在場上",
        }).then((v) => {
          fightWrap.classList.add("hidden");
        });
        return;
      } else {
        this.popUps({
          type: "success",
          title: "開始",
          content: "確定開始戰鬥嗎",
          cancelBtn: true,
        }).then((v) => {
          fightWrap.classList.add("hidden");
          window._globalAutoChess.fightRender();
          window._globalAutoChess.fight();
        });
      }
    });
  },
};
