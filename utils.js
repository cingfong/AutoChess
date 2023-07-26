import language from "./static/i18n.js";
export default {
  loadCtl: true,
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
    window.landscape = false;
    if (window.orientation == 180 || window.orientation == 0) {
      window.landscape = false;
      remindDom.classList.remove("flex");
      remindDom.classList.add("hidden");
    }
    if (window.orientation == 90 || window.orientation == -90) {
      remindDom.classList.remove("hidden");
      remindDom.classList.add("flex");
      window.landscape = true;
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
    fightBtn.onclick = null;
    fightBtn.onclick = () => {
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
    };
  },
  doubleFinger() {
    document.documentElement.addEventListener(
      "touchstart",
      (event) => {
        if (event.touches.length > 1) {
          event.preventDefault();
        }
      },
      { passive: false }
    );
  },
  doubleTouch() {
    let lastTouchEndTime = 0;
    let lastTouchEndPosition = { X: 0, Y: 0 };
    document.documentElement.addEventListener(
      "touchend",
      (event) => {
        const position = {
          X: event.changedTouches[0].pageX,
          Y: event.changedTouches[0].pageY,
        };
        const diferenceX = lastTouchEndPosition.X
          ? lastTouchEndPosition.X - position.X
          : false;
        const diferenceY = lastTouchEndPosition.Y
          ? lastTouchEndPosition.Y - position.Y
          : false;
        const now = Date.now();
        if (
          now - lastTouchEndTime <= 300 &&
          Math.abs(diferenceX) < 15 &&
          Math.abs(diferenceY) < 15
        ) {
          event.preventDefault();
        }
        lastTouchEndTime = now;
        lastTouchEndPosition.X = position.X;
        lastTouchEndPosition.Y = position.Y;
      },
      {
        passive: false,
      }
    );
  },
  async loadImage(imgList) {
    this.load(true);
    window.gameImageList = [];
    const _gloablImgList = window.gameImageList;
    await imgList.forEach((item) => {
      const img = new Image();
      img.src = item;
      _gloablImgList.push(img);
    });
    await this.load(false);
  },
  load(ctl) {
    const _this = this;
    _this.loadCtl = ctl;
    const _loadCtl = _this.loadCtl;
    const element = document.querySelector(".loading");
    const elementSpan = document.querySelector(".loading span");
    if (!_loadCtl || typeof _loadCtl !== Boolean) {
      element.style.display = "none";
      return;
    }
    const spanContent = elementSpan.textContent;
    element.style.display = "flex";
    if (spanContent.length !== 4) {
      elementSpan.textContent = spanContent + ".";
    } else {
      elementSpan.textContent = ".";
    }
    setTimeout(() => {
      _this.load();
    }, 500);
  },
  i18n: {
    langObject: null,
    t(text) {
      if (!this.langObject || !text) return "";
      const langKeyList = text.split(".");
      const getText = (lang, langKeyList) => {
        const _key = langKeyList.shift();
        const _lang = lang[_key];
        if (langKeyList.length) {
          return getText(_lang, langKeyList);
        }
        return _lang;
      };
      return getText(this.langObject, langKeyList);
    },
    init(lang = "zh-Hant") {
      this.langObject = language[lang] ?? null;
    },
    text() {
      const DomList = document.querySelectorAll(".i18n-text");
      [...DomList].forEach((item) => {
        const dataText = item.dataset.i18nText;
        if (dataText) {
          item.textContent = this.t(dataText);
          return;
        }
        const text = item.textContent;
        item.dataset.i18nText = text;
        item.textContent = this.t(text);
      });
    },
  },
};
