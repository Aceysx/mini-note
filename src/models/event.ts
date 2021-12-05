import mitt from "mitt";
import { getDvaApp } from "umi";
import FileModel from "./file";
import GlobalModel from "@/models/global";

export enum Event {
  INIT_NOTEBOOK_EVENT = "INIT_NOTEBOOK_EVENT",
  CREATE_FILE_OR_DIR = "CREATE_FILE_OR_DIR",
  FETCH_FILE_EVENT = "FETCH_FILE_EVENT",
  MODIFY_FILE_CONTENT = "MODIFY_FILE_CONTENT",
  MODIFY_FILE_NAME = "MODIFY_FILE_NAME"
}

export const emitter = mitt();

export const publish = (type: Event, data: any) => {
  emitter.emit(type, data);
};

emitter.on(Event.INIT_NOTEBOOK_EVENT, fileMode => {
  getDvaApp()._store.dispatch({
    type: FileModel.actionType,
    rootFile: fileMode
  });
});

emitter.on(Event.FETCH_FILE_EVENT, fileMode => {
  getDvaApp()._store.dispatch({
    type: FileModel.actionType,
    currentEditFile: fileMode
  });
});

emitter.on(Event.MODIFY_FILE_NAME, () => {
  GlobalModel.dispatch.notebook();
});
