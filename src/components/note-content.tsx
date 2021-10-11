import * as React from "react";
import { useEffect, useState } from "react";
import FileModel from "@/models/file";
import SimpleMdeReact from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import Box from "@mui/material/Box/Box";
import { Input } from "@mui/material";
import GlobalModel from "@/models/global";
import { plainToClass } from "class-transformer";

const NoteContent = ({
  file,
  parentDir
}: {
  file: FileModel;
  parentDir: FileModel | undefined;
}) => {
  const [filename, setFilename] = useState("");
  useEffect(() => {
    setFilename(file.parseDisplayName());
  }, [file]);

  const updateFileName = () => {
    if (!parentDir) {
      return;
    }
    const existFile = parentDir
      .getSub()
      .find(item => item.path.endsWith(filename));
    if (existFile) {
      GlobalModel.dispatch.message({
        isOpen: true,
        severity: "warning",
        message: `${filename} file is exist`
      });
      return;
    }
    file.updateFileName(filename);

    const subs = parentDir.getSub().map(item => {
      return item.path === file.path
        ? { ...item, path: item.parseNewFileName(filename) }
        : item;
    });

    GlobalModel.dispatch.siderbarState({
      currentSelectedDirFile: plainToClass(FileModel, {
        ...parentDir,
        sub: subs
      })
    });

    FileModel.fetchEditFile(file.parseNewFileName(filename));
  };

  return (
    <Box>
      <Box
        sx={{
          width: "100%",
          marginBottom: 1
        }}
      >
        <Input
          fullWidth
          value={filename}
          onChange={e => setFilename(e.target.value)}
          onBlur={updateFileName}
          onKeyPress={updateFileName}
          inputProps={{ "aria-label": "description" }}
        />
      </Box>
      <SimpleMdeReact
        value={file.content}
        onChange={content => file.updateContent(content)}
      />
    </Box>
  );
};
export default NoteContent;
