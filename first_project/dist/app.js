"use strict";
class ProjectInput {
    constructor() {
        this.templateElement = document.getElementById('project-input');
        this.hostElement = document.getElementById('app');
        const importedNode = document.importNode(this.templateElement.content, true);
        this.element = importedNode.firstElementChild;
    }
    attach() {
        this.hostElement.insertAdjacentElement('afterbegin', this.element);
    }
}
//# sourceMappingURL=app.js.map