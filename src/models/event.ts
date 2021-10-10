import mitt from 'mitt'
import {getDvaApp} from 'umi'
import FileModel from './file'

export enum Event {
  INIT_NOTEBOOK_EVENT = "INIT_NOTEBOOK_EVENT"
}

export const emitter = mitt()

export const publish = (type: Event, data: any) => {
  emitter.emit(type, data)
}

emitter.on(Event.INIT_NOTEBOOK_EVENT, fileMode => {
  getDvaApp()._store.dispatch({
    type: FileModel.actionType,
    rootFile: fileMode
  });
});

