import { Reducer } from "umi";
import FileModel from "@/models/file";
import { getDvaApp } from "@@/plugin-dva/exports";

export interface SiderbarState {
  rootFile: FileModel | undefined;
  dirsOpenState: {};
  currentSelectedDirFile: FileModel | undefined;
  currentEditFile: FileModel | undefined;
}

export interface MessageState {
  severity?: "info" | "error" | "warning" | "success";
  isOpen: boolean;
  message?: string | undefined;
}

export interface GlobalModelState {
  workspace: string;
  siderbarState: SiderbarState;
  messageState: MessageState;
}

export interface GlobalModelType {
  namespace: "global";
  state: GlobalModelState;
  effects: {};
  reducers: {
    siderbarState: Reducer<GlobalModelState>;
    messageState: Reducer<GlobalModelState>;
  };
  dispatch: {
    message: Function;
    notebook: Function;
    siderbarState: Function;
  };
}

const GlobalModel: GlobalModelType = {
  namespace: "global",
  state: {
    workspace: window.localStorage.getItem("workspace") + "",
    siderbarState: {
      rootFile: undefined,
      dirsOpenState: {},
      currentSelectedDirFile: undefined,
      currentEditFile: undefined
    },
    messageState: {
      isOpen: false
    }
  },
  dispatch: {
    message: (data: MessageState) => {
      getDvaApp()._store.dispatch({
        type: "global/messageState",
        ...data
      });
    },
    notebook: () => {
      const defaultPath = "/Users/xinsi/Documents/PERSONAL/notebook";
      FileModel.fetchFilesByPath(
        localStorage.getItem("note_workspace") || defaultPath
      );
    },
    siderbarState: (data: any) => {
      getDvaApp()._store.dispatch({
        type: "global/siderbarState",
        ...data
      });
    }
  },
  effects: {},
  reducers: {
    siderbarState(state: any, data: any): any {
      return {
        ...state,
        ...{ siderbarState: { ...state.siderbarState, ...data } }
      };
    },
    messageState(state: any, data: any): any {
      return {
        ...state,
        ...{ messageState: { ...state.messageState, ...data } }
      };
    }
  }
};

export default GlobalModel;
