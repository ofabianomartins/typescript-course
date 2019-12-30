import { autobind } from '../decorators/autobind';
import { Project } from '../models/project';
import {DragTarget, Draggable} from '../models/drag-drop';
import {Component} from './base_components';


// ProjectItem Class
export class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
    private project: Project;

    get persons() {
    if( this.project.people === 1) {
        return '1 person assigned';
    } else {
        return `${this.project.people} persons assigned`;
    }
    }

    constructor(hostId: string, project: Project) {
    super("single-project", hostId, false, project.id);

    this.project = project;

    this.configure();
    this.renderComponent();
    }

    protected configure(){ 
    this.element.addEventListener('dragstart', this.dragStartHandler);
    // this.element.addEventListener('dragstart', this.dragStartHandler);
    }

    protected renderComponent(){
    this.element.querySelector(
        'h2'
    )!.textContent = this.project.title;
    this.element.querySelector(
        'h3'
    )!.textContent = this.persons;
    this.element.querySelector(
        'p'
    )!.textContent = this.project.description;
    }

    @autobind
    dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData('text/plain', this.project.id);
    event.dataTransfer!.effectAllowed = 'move';
    }

    @autobind
    dragEndHandler(event: DragEvent) {
    console.log('DragEnd')
    }

}