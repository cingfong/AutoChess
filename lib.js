
const lib = {
    createDOM: (label, text, attr) => {
        const DOM = document.createElement(label)
        if (text) DOM.textContent = text
        if (attr) {
            for (const key in attr) {
                DOM[key] = attr[key]
            }
        }
        return DOM
    }
}
export default lib;