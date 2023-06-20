export default {
  popUps: ({ type, title, content }) => {
    return new Promise((resolve, reject) => {
      const wrap = document.querySelector(".pop-up-card");
      const titleDom = wrap.querySelector(".title");
      const contentDom = wrap.querySelector(".content");
      titleDom.textContent = title;
      contentDom.textContent = content;
      const confirmBtn = wrap.querySelector(".button.confirm");
      const clickMethod = () => {
        wrap.classList.add("hidden");
        confirmBtn.removeEventListener("click", clickMethod);
        resolve();
      };
      confirmBtn.addEventListener("click", clickMethod);
    });
  },
};
