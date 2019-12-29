/// <reference path="base_components.ts" />
/// <reference path="project_item.ts" />

namespace App { 
    // ProjectList Class
    export class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
        assignedProjects: Project[] = [];

        constructor(private type: 'active' | 'finished') {
        super("project-list", "app", false, `${type}-projects`)

        this.configure();
        this.renderComponent();
        }

        configure() {
        this.element.addEventListener('dragover', this.dragOverHAndler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        projectState.addListener((projects: any[]) => {
            this.assignedProjects = projects.filter((prj) => { 
            if( this.type === 'active') {
                return prj.status === ProjectStatus.Active;
            }
            return prj.status === ProjectStatus.Finished;
            });
            this.renderProjects();
        });

        }

        @autobind
        dragOverHAndler(event: DragEvent) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain'){
            event.preventDefault();
            const listElem = this.element.querySelector('ul')!;
            listElem.classList.add('droppable');

        }
        }

        @autobind
        dropHandler(event: DragEvent) {
        const prjId = event.dataTransfer!.getData('text/plain');
        projectState.changeProjectStatus(
            prjId, 
            this.type === 'active' ? ProjectStatus.Active : ProjectStatus.Finished
        )
        }

        @autobind
        dragLeaveHandler( event: DragEvent) {
        const listElem = this.element.querySelector('ul')!;
        listElem.classList.remove(
            'droppable'
        )
        }

        private renderProjects(){
        const listElem = this.element.querySelector('ul') as HTMLUListElement;
        listElem.innerHTML = '';
        for( const prjItem of this.assignedProjects){
            new ProjectItem(listElem.id, prjItem);
        }
        }

        protected renderComponent() {
        const listId = `${this.type}-projects-list`;
        this.element.querySelector('ul')!.id = listId;
        this.element.querySelector('h2')!.textContent = this.type.toUpperCase() + ' PROJECTS';
        }

    }
}