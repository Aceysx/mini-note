import React from "react";
import "../global.less";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Grid from "@mui/material/Grid";
import FileCard from "@/components/file-card";
import { connect } from "umi";
import { GlobalModelState, SiderbarState } from "@/models/global";

import "./note-body.less";
import FileModel from "@/models/file";
import NoteContent from "@/components/note-content";

const NoteBody = ({
  dispatch,
  siderbarState
}: {
  dispatch: any;
  siderbarState: SiderbarState;
}) => {
  const { currentSelectedDirFile, currentEditFile } = siderbarState;
  const selectFile = (file: FileModel) => {
    if (file.isDir()) {
      dispatch({
        type: FileModel.actionType,
        currentSelectedDirFile: file
      });
    } else {
      FileModel.fetchEditFile(file);
    }
  };
  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        {currentSelectedDirFile
          ? currentSelectedDirFile
              .getSub()
              .map(item => <FileCard file={item} selectFile={selectFile} />)
          : ""}
      </Grid>
      <Grid item xs={9}>
        {currentEditFile ? <NoteContent file={currentEditFile} /> : ""}
      </Grid>
    </Grid>
  );
};
export default connect(({ global }: { global: GlobalModelState }) => {
  return {
    siderbarState: global.siderbarState
  };
})(NoteBody);
