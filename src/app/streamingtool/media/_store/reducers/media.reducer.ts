import { createSelector } from 'reselect';
import * as videos from '../actions/media.actions';
import { Video } from 'app/streamingtool/_model/video';


export interface State {
  ids: string[];
  entities: { [id: string]: Video };
  selectedVideoId: string | null;
};

export const initialState: State = {
  ids: [],
  entities: {},
  selectedVideoId: null,
};

export function reducer(state = initialState, action: videos.Actions): State {
  switch (action.type) {
    case videos.SEARCH_COMPLETE: {
      const videos = action.payload;
      const newVideos = videos.filter(video => !state.entities[video.id]);

      const newVideosIds = newVideos.map(video => video.id);
      const newVideoEntities = newVideos.reduce((entities: { [id: string]: Video }, video: Video) => {
        return Object.assign(entities, {
          [video.id]: video
        });
      }, {});

      return {
        ids: [ ...state.ids, ...newVideosIds ],
        entities: Object.assign({}, state.entities, newVideoEntities),
        selectedVideoId: state.selectedVideoId
      };
    }

    case videos.LOAD: {
      const video = action.payload;

      if (state.ids.indexOf(video.id) > -1) {
        return state;
      }

      return {
        ids: [ ...state.ids, video.id ],
        entities: Object.assign({}, state.entities, {
          [video.id]: video
        }),
        selectedVideoId: state.selectedVideoId
      };
    }

    case videos.SELECT: {
      return {
        ids: state.ids,
        entities: state.entities,
        selectedVideoId: action.payload
      };
    }

    default: {
      return state;
    }
  }
}

/**
 * Because the data structure is defined within the reducer it is optimal to
 * locate our selector functions at this level. If store is to be thought of
 * as a database, and reducers the tables, selectors can be considered the
 * queries into said database. Remember to keep your selectors small and
 * focused so they can be combined and composed to fit each particular
 * use-case.
 */

export const getEntities = (state: State) => state.entities;

export const getIds = (state: State) => state.ids;

export const getSelectedId = (state: State) => state.selectedVideoId;

export const getSelected = createSelector(getEntities, getSelectedId, (entities, selectedId) => {
  return entities[selectedId];
});

export const getAll = createSelector(getEntities, getIds, (entities, ids) => {
  return ids.map(id => entities[id]);
});
