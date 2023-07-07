const lib = {
  createDOM: (label, text, attr) => {
    const DOM = document.createElement(label);
    if (text) DOM.textContent = text;
    if (attr) {
      for (const key in attr) {
        DOM[key] = attr[key];
      }
    }
    return DOM;
  },
  judgeObjectSame(oldObj, newObj) {
    const oldObjStr = JSON.stringify(oldObj);
    const newObjStr = JSON.stringify(newObj);
    return oldObjStr === newObjStr;
  },
};
export default lib;
