import * as React from "react";
import { useEffect, useState } from "react";
import FileModel from "@/models/file";
import Box from "@mui/material/Box/Box";
import { Input } from "@mui/material";
import GlobalModel from "@/models/global";
import { plainToClass } from "class-transformer";
import Vditor from "vditor";
import "vditor/dist/index.css";

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
    createVidtor({ value: file.content });
  }, [file.path]);

  const createVidtor = params => {
    let { value } = params;
    value = value ? value : " ";
    const vditor = new Vditor("vditor", {
      //Markdown上面的高度
      height: document.body.clientHeight - 50,
      mode: "wysiwyg", //及时渲染模式
      toolbar: [
        "upload",
        "table",
        "|",
        "fullscreen",
        "|",
        "code-theme",
        "content-theme",
        "export",
        "outline",
        "|",
        {
          hotkey: "⌘-S",
          name: "save",
          tipPosition: "s",
          tip: "保存",
          className: "right",
          icon: `<img style="height: 16px" src='https://img.58cdn.com.cn/escstatic/docs/imgUpload/idocs/save.svg'/>`,
          click() {
            // that.saveDoc();
          }
        }
      ],
      after() {
        vditor.setValue(value);
      },
      blur() {
        // that.saveDoc();
      },
      upload: {
        accept: "image/*",
        multiple: false,
        filename(name) {
          return name
            .replace(/[^(a-zA-Z0-9\u4e00-\u9fa5\.)]/g, "")
            .replace(/[\?\\/:|<>\*\[\]\(\)\$%\{\}@~]/g, "")
            .replace("/\\s/g", "");
        }
      }
    });
    return vditor;
  };
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
      <div>
        <div id="vditor" />
      </div>
    </Box>
  );
};
export default NoteContent;
