import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FileModel from "@/models/file";

const FileCard = ({ file }: { file: FileModel }) => {
  return (
    <Card className={"file-card"} variant={"outlined"}>
      <CardContent>
        <Typography variant="subtitle1" component="div">
          {file.parseDisplayName()}
        </Typography>
      </CardContent>
      <CardActions sx={{ float: "right" }}>
        <Button size="small" color={"warning"}>
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};
export default FileCard;
