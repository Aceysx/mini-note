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

export interface SettingState {
  workspace: string | null;
  openFileModel: boolean;
}

export interface GlobalModelState {
  siderbarState: SiderbarState;
  messageState: MessageState;
  settingState: SettingState;
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
    settingState: Function;
  };
}

const GlobalModel: GlobalModelType = {
  namespace: "global",
  state: {
    siderbarState: {
      rootFile: undefined,
      dirsOpenState: {},
      currentSelectedDirFile: undefined,
      currentEditFile: undefined
    },
    messageState: {
      isOpen: false
    },
    settingState: {
      openFileModel: false,
      workspace: window.localStorage.getItem("workspace")
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
      let workspace = localStorage.getItem("workspace");

      if (workspace) {
        FileModel.fetchFilesByPath(
          // @ts-ignore
          localStorage.getItem("workspace")
        );
      } else {
        getDvaApp()._store.dispatch({
          type: "global/settingState",
          openFileModel: true
        });
      }
    },
    siderbarState: (data: any) => {
      getDvaApp()._store.dispatch({
        type: "global/siderbarState",
        ...data
      });
    },
    settingState: (data: any) => {
      getDvaApp()._store.dispatch({
        type: "global/settingState",
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
    },
    // @ts-ignore
    settingState(state: any, data: any): any {
      console.log(data);
      return {
        ...state,
        ...{ settingState: { ...state.settingState, ...data } }
      };
    }
  }
};

export default GlobalModel;
