/// <reference path="models/drag-drop.ts" />
/// <reference path="models/project.ts" />
/// <reference path="states/project.ts" />
/// <reference path="util/validation.ts" />
/// <reference path="decorators/autobind.ts" />
/// <reference path="components/project_input.ts" />
/// <reference path="components/project_list.ts" />

namespace App {

  const prjInput = new ProjectInput();
  const activePrjList = new ProjectList('active');
  const finishedPrjList = new ProjectList('finished');

}