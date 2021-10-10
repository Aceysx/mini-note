import * as React from "react";
import FileModel from "@/models/file";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

const NoteContent = ({ file }: { file: FileModel }) => {
  return (
    <SimpleMdeReact
      value={file.content}
      onChange={value => {
        console.log(value);
      }}
    />
  );
};
export default NoteContent;
