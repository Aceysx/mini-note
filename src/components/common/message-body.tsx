import React from "react";
import { connect } from "umi";
import GlobalModel, { GlobalModelState, SettingState } from "@/models/global";
import FileResource from "@/infrastructure/file-resource";

const OpenFileModel = ({ settingState }: { settingState: SettingState }) => {
  const { openFileModel } = settingState;
  if (openFileModel) {
    let dirPath = FileResource.openDir();
    localStorage.setItem("workspace", dirPath);
    GlobalModel.dispatch.settingState({ openFileModel: false });
    GlobalModel.dispatch.notebook();
  }
  return <div />;
};
export default connect(({ global }: { global: GlobalModelState }) => {
  return {
    settingState: global.settingState
  };
})(OpenFileModel);
