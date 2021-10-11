import React, { useEffect } from "react";
import "../global.less";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Grid from "@mui/material/Grid";
import Sidebar from "@/layouts/sidebar";
import MessageBody from "@/components/common/message-body";
import GlobalModel from "@/models/global";
import { Content } from "./content";

export default function() {
  useEffect(() => {
    GlobalModel.dispatch.notebook();
  }, []);

  return (
    <Grid container className="container">
      <Grid item xs={3} style={{ background: "#fafafa" }}>
        <Sidebar />
      </Grid>
      <Grid item xs={9} className={"bg-white"}>
        <Content />
      </Grid>
      <MessageBody />
    </Grid>
  );
}
