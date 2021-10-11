import React from "react";
import "../global.less";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Grid from "@mui/material/Grid";
import FileCard from "@/components/file-card";
import { connect } from "umi";
import GlobalModel, { GlobalModelState, SiderbarState } from "@/models/global";
import FileModel from "@/models/file";
import NoteContent from "@/components/note-content";

import "./note-body.less";

const NoteBody = ({
  siderbarState
}: {
  dispatch: any;
  siderbarState: SiderbarState;
}) => {
  const { currentSelectedDirFile, currentEditFile } = siderbarState;
  const selectFile = (file: FileModel) => {
    if (file.isDir()) {
      GlobalModel.dispatch.siderbarState({
        currentSelectedDirFile: file
      });
    } else {
      FileModel.fetchEditFile(file.path);
    }
  };

  return (
    <Grid container>
      <Grid
        item
        xs={3}
        className={"layout_scroll_hide"}
        style={{ height: document.body.clientHeight, overflowY: "scroll" }}
      >
        {currentSelectedDirFile
          ? currentSelectedDirFile
              .getSub()
              .map(item => (
                <FileCard
                  isSelected={
                    !!currentEditFile && item.path === currentEditFile.path
                  }
                  file={item}
                  selectFile={selectFile}
                />
              ))
          : ""}
      </Grid>
      <Grid item xs={9} style={{ height: document.body.clientHeight }}>
        {currentEditFile ? (
          <NoteContent
            file={currentEditFile}
            parentDir={currentSelectedDirFile}
          />
        ) : (
          ""
        )}
      </Grid>
    </Grid>
  );
};
export default connect(({ global }: { global: GlobalModelState }) => {
  return {
    siderbarState: global.siderbarState
  };
})(NoteBody);
