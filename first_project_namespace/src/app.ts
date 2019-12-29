// Drag & Drop Interfaces

interface Draggable {
  dragStartHandler( event: DragEvent): void;
  dragEndHandler( event: DragEvent): void;
}

interface DragTarget {
  dragOverHAndler( event: DragEvent ): void;
  dropHandler( event: DragEvent ): void;
  dragLeaveHandler( event: DragEvent ): void;
}

// Project Class

enum ProjectStatus {Active, Finished};


class Project {
  constructor(
    public id: string,
    public title: string,
    public description:string,
    public people: number,
    public status: ProjectStatus
  ) {

  }

}


// ProjectState Class

type Listener<T> = (items: T[]) => void;

// listenerUpdater decorator
// function listenerUpdate(
//     target: any, 
//     methodName: string, 
//     descriptor: PropertyDescriptor
// ){
//   const originalMethod = descriptor.value;
//   const adjDescriptor: PropertyDescriptor = {
//     configurable: true,
//     get(){
//       const boundFn = originalMethod.bind(this);
//       return () => {
//         originalMethod()
//         this.updateListeners();
//       }
//     }
//   }
//   return adjDescriptor;
// }

abstract class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }

}

class ProjectState extends State<Project>{
  private projects: Project[] = [];

  private static instance: ProjectState;

  static getInstance() : ProjectState {
    if( !this.instance){
      this.instance = new ProjectState();
    }
    return this.instance;
  }

  private constructor(){
    super();
  }

  addProject(title: string, description: string, numberOfPeople: number){
    const newProject = new Project(
      Math.random().toString(),
      title,
      description,
      numberOfPeople,
      ProjectStatus.Active
    );
    
     this.projects.push(newProject);
     this.updateListeners();
  }

  changeProjectStatus(projectId: string, newStatus: ProjectStatus) {
    const project = this.projects.find(prj => prj.id === projectId);
    if (project && project.status !== newStatus) {
      project.status = newStatus;
      this.updateListeners();
    }
  }

  protected updateListeners() {
    for(const listernerFn of this.listeners) {
      listernerFn(this.projects.slice());
    }
  }

   

}

const projectState = ProjectState.getInstance();

// Validator 
interface Validatable {
  value: string | number;
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
}

function validate(validatableInput: Validatable){
  let isValid = true;

  if( validatableInput.required) {
    isValid = isValid && validatableInput.value.toString().trim().length !== 0;
  }

  if( validatableInput.minLength != null && typeof validatableInput.value == 'string' ){
    isValid = isValid && validatableInput.value.length >= validatableInput.minLength;
  } 

  if( validatableInput.maxLength != null && typeof validatableInput.value == 'string' ){
    isValid = isValid && validatableInput.value.length <= validatableInput.maxLength;
  } 

  if( validatableInput.min != null && typeof validatableInput.value == 'number' ){
    isValid = isValid && validatableInput.value >= validatableInput.min;
  } 

  if( validatableInput.max != null && typeof validatableInput.value == 'number' ){
    isValid = isValid && validatableInput.value <= validatableInput.max;
  } 

  return isValid;
}

// autobind decorator
function autobind(target: any, methodName: string, descriptor: PropertyDescriptor){
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get(){
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  }
  return adjDescriptor;
}

// Component Base Class

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(
    templateId: string, 
    hostElementId: string,
    insertAtBegining: boolean,
    newElementId?: string 
  ) {

    this.templateElement = document.getElementById(
      templateId
    ) as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostElementId)! as T;
    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if( newElementId) {
      this.element.id = newElementId;  
    }

    this.attach(insertAtBegining);
  }

  private attach(insertAtBegining: boolean) {
    this.hostElement.insertAdjacentElement(
      insertAtBegining ? "afterbegin" : "beforeend", 
      this.element
    );
  }

  protected abstract configure(): void;
  protected abstract renderComponent(): void;
}

// ProjectItem Class
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable{
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

// ProjectList Class
class ProjectList extends Component<HTMLDivElement, HTMLElement> implements DragTarget{
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


// ProjectCalss Input
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement:  HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", 'app', true, "user-input")

    this.titleInputElement = this.element.querySelector("#title") as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector("#description") as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector("#people") as HTMLInputElement;

    this.configure();
  }

  private gatherUser(): [string, string, number] | undefined{
    const enteredTitle = this.titleInputElement.value;
    const enteredDescription = this.descriptionInputElement.value;
    const enteredPeople = this.peopleInputElement.value;

    const titleValidatable: Validatable = {
      value: enteredTitle,
      required: true
    }

    const descriptionValidatable: Validatable = {
      value: enteredDescription,
      required: true,
      minLength: 5
    }

    const peopleValidatable: Validatable = {
      value: enteredPeople,
      required: true,
      min: 1, 
      max: 5
    }

    if(
      !validate(titleValidatable) ||
      !validate(descriptionValidatable) ||
      !validate(peopleValidatable)
    ){
      alert("Insert a valid value to all fields");
      return;
    } else {
      return [enteredTitle, enteredDescription, +enteredPeople];
    }

  }

  private clearInputs() {
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value = '';
  }

  @autobind
  private submitHandler(event: Event){
    event.preventDefault();
    const userInput = this.gatherUser();

    if(Array.isArray(userInput)) {
      const [title, description, people] = userInput;

      projectState.addProject(title,description,people);
      this.clearInputs();
    }
  }

  protected renderComponent() {

  }

  protected configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }

}

const prjInput = new ProjectInput();
const activePrjList = new ProjectList('active');
const finishedPrjList = new ProjectList('finished');