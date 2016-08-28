'use babel';


export default class AtomPypiView {

    constructor(serializedState) {
      // Create root element
      this.tempElement = document.createElement('div');
    }

    // Returns an object that can be retrieved when package is activated
    serialize() {}

    // Tear down any state and detach
    destroy() {
      this.tempElement.remove();
    }

    getTempElement() {
      return this.tempElement;
    }

    setTempMsg(msg) {
        const tempMessage = document.createElement('div');
        tempMessage.textContent = msg;
        tempMessage.classList.add('tempMessage');
        this.tempElement.innerHTML = "";
        this.tempElement.appendChild(tempMessage);
    }

}
