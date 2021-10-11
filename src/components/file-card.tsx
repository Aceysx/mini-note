import * as React from "react";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import FileModel from "@/models/file";

const FileCard = ({
  file,
  selectFile,
  isSelected
}: {
  file: FileModel;
  selectFile: Function;
  isSelected: boolean;
}) => {
  return (
    <Card
      className={`file-card ${isSelected ? "file-card-selected" : ""}`}
      variant={"outlined"}
      onClick={() => selectFile(file)}
    >
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
