import { Reducer } from "umi";
import FileModel from "@/models/file";

export interface SiderbarState {
  rootFile: FileModel | undefined;
  dirsOpenState: {};
}

export interface GlobalModelState {
  workspace: string;
  siderbarState: SiderbarState;
}

export interface GlobalModelType {
  namespace: "global";
  state: GlobalModelState;
  effects: {};
  reducers: {
    siderbarState: Reducer<GlobalModelState>;
  };
}

const GlobalModel: GlobalModelType = {
  namespace: "global",
  state: {
    workspace: window.localStorage.getItem("workspace") + "",
    siderbarState: { rootFile: undefined, dirsOpenState: {} }
  },
  effects: {},
  reducers: {
    siderbarState(state: any, data: any): any {
      return {
        ...state,
        ...{ siderbarState: { ...state.siderbarState, ...data } }
      };
    }
  }
};

export default GlobalModel;
