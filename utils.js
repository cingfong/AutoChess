export default {
  popUps: ({ type, title, content }) => {
    const typeClass = type === 'win' ? 'win' : 'fail'
    const resetClass = (dom) => {
      ['win', 'fail'].forEach(classItem => {
        dom.classList.remove(classItem)
      });
    }
    return new Promise((resolve, reject) => {
      const wrap = document.querySelector(".pop-up-card");
      const titleDom = wrap.querySelector(".title");
      const contentDom = wrap.querySelector(".content");
      const buttonDom = wrap.querySelector(".button");
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
    });
  },
};