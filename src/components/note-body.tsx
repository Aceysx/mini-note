import React from "react";
import "../global.less";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Grid from "@mui/material/Grid";
import { connect } from "umi";
import { GlobalModelState, SiderbarState } from "@/models/global";
import NoteContent from "@/components/note-content";

import "./note-body.less";

const NoteBody = ({
  siderbarState
}: {
  dispatch: any;
  siderbarState: SiderbarState;
}) => {
  const { currentSelectedDirFile, currentEditFile } = siderbarState;

  return (
    <Grid container>
      <Grid item xs={12} style={{ height: document.body.clientHeight }}>
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
