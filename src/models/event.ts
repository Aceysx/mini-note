import mitt from "mitt";
import { getDvaApp } from "umi";
import FileModel from "./file";
import GlobalModel from "@/models/global";

export enum Event {
  INIT_NOTEBOOK_EVENT = "INIT_NOTEBOOK_EVENT",
  CREATE_FILE_OR_DIR = "CREATE_FILE_OR_DIR",
  FETCH_FILE_EVENT = "FETCH_FILE_EVENT",
  MODIFY_FILE_CONTENT = "MODIFY_FILE_CONTENT",
  MODIFY_FILE_NAME = "MODIFY_FILE_NAME",
  DELETE_FILE_OR_DIR = "DELETE_FILE_OR_DIR",
  OPEN_DIR = "OPEN_DIR"
}

export const emitter = mitt();

export const publish = (type: Event, data: any) => {
  emitter.emit(type, data);
};

emitter.on(Event.INIT_NOTEBOOK_EVENT, fileModel => {
  getDvaApp()._store.dispatch({
    type: FileModel.actionType,
    rootFile: fileModel,
    dirsOpenState: [fileModel.path]
  });
});

emitter.on(Event.FETCH_FILE_EVENT, fileModel => {
  getDvaApp()._store.dispatch({
    type: FileModel.actionType,
    currentEditFile: fileModel
  });
});

emitter.on(Event.MODIFY_FILE_NAME, () => {
  GlobalModel.dispatch.notebook();
});

emitter.on(Event.DELETE_FILE_OR_DIR, file => {
  GlobalModel.dispatch.notebook();
  let {
    currentSelectedDirFile,
    currentEditFile
  } = getDvaApp()._store.getState().global.siderbarState;
  if (currentSelectedDirFile && file.filePath === currentSelectedDirFile.path) {
    currentSelectedDirFile = undefined;
  }
  if (currentEditFile && currentEditFile.path.includes(file.filePath)) {
    currentEditFile = undefined;
  }
  GlobalModel.dispatch.siderbarState({
    currentSelectedDirFile,
    currentEditFile
  });
});
