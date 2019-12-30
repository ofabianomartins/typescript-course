import { autobind } from '../decorators/autobind';
import { Component } from './base_components';
import { Validatable, validate } from '../util/validation';
import { projectState } from '../states/project';


// ProjectClass Input
export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
