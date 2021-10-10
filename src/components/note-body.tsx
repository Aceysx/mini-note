import React from "react";
import "../global.less";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Grid from "@mui/material/Grid";

export default function() {
  return (
    <Grid container spacing={2} className="container">
      <Grid item xs={3}>
        left menu
      </Grid>
      <Grid item xs={9}>
        right
      </Grid>
    </Grid>
  );
}
