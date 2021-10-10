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

const NoteBody = ({
  dispatch,
  siderbarState
}: {
  dispatch: any;
  siderbarState: SiderbarState;
}) => {
  const { currentSelectedDirFile } = siderbarState;

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        {currentSelectedDirFile
          ? currentSelectedDirFile
              .getSub()
              .map(item => <FileCard file={item} />)
          : ""}
      </Grid>
      <Grid item xs={9}>
        right
      </Grid>
    </Grid>
  );
};
export default connect(({ global }: { global: GlobalModelState }) => {
  return {
    siderbarState: global.siderbarState
  };
})(NoteBody);
