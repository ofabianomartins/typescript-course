import { Project, ProjectStatus} from '../models/project.js'

type Listener<T> = (items: T[]) => void;

abstract class State<T> {
  protected listeners: Listener<T>[] = [];

  addListener(listener: Listener<T>) {
    this.listeners.push(listener);
  }

}

export class ProjectState extends State<Project>{
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

export const projectState = ProjectState.getInstance();