export default {
  popUps: ({ type = 'win', title, content, cancelBtn }) => {
    const typeClassList = ['win', 'fail', 'error', 'success']
    const typeClass = type
    const resetClass = (dom) => {
      typeClassList.forEach(classItem => {
        dom.classList.remove(classItem)
      });
    }
    return new Promise((resolve, reject) => {
      const wrap = document.querySelector(".pop-up-card");
      const titleDom = wrap.querySelector(".title");
      const contentDom = wrap.querySelector(".content");
      const buttonDom = wrap.querySelector(".button");
      const cancelButtonDom = wrap.querySelector(".cancel");
      if (cancelBtn) {
        cancelButtonDom.classList.remove('hidden')
      } else {
        cancelButtonDom.classList.add('hidden')
      }
      resetClass(wrap)
      resetClass(titleDom)
      resetClass(buttonDom)
      wrap.classList.add(typeClass)
      titleDom.classList.add(typeClass)
      buttonDom.classList.add(typeClass)
      titleDom.textContent = title;
      contentDom.textContent = content;
      const clickMethod = () => {
        wrap.classList.add("hidden");
        buttonDom.removeEventListener("click", clickMethod);
        resolve();
      };
      // 彈窗顯示
      if ([...wrap.classList].includes('hidden')) {
        wrap.classList.remove('hidden')
      }
      buttonDom.addEventListener("click", clickMethod);
      cancelButtonDom.addEventListener("click", () => {
        wrap.classList.add('hidden')
      })
    });
  },
};