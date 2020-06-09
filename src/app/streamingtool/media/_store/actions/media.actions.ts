import { Action } from '@ngrx/store';
import { Video } from 'app/streamingtool/_model/video';

export const SEARCH =           '[Video StreamingTool] Search';
export const SEARCH_COMPLETE =  '[Video StreamingTool] Search Complete';
export const LOAD_ALL =         '[Video StreamingTool] Load All Videos';
export const LOAD_ALL_COMPLETE = '[Video StreamingTool] Load All Videos Complete';
export const LOAD =             '[Video StreamingTool] Load';
export const SELECT =           '[Video StreamingTool] Select';


export class SearchAction implements Action {
    readonly type = SEARCH;

    constructor(public payload: string) { }
  }

  export class SearchCompleteAction implements Action {
    readonly type = SEARCH_COMPLETE;

    constructor(public payload: Video[]) { }
  }

  export class LoadAction implements Action {
    readonly type = LOAD;

    constructor(public payload: Video) { }
  }

  export class SelectAction implements Action {
    readonly type = SELECT;

    constructor(public payload: string) { }
  }

  /**
   * Export a type alias of all actions in this action group
   * so that reducers can easily compose action types
   */
  export type Actions
    = SearchAction
    | SearchCompleteAction
    | LoadAction
    | SelectAction;

