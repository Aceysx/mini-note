import * as React from "react";
import { useEffect, useState } from "react";
import FileModel from "@/models/file";
import GlobalModel from "@/models/global";
import { plainToClass } from "class-transformer";
import Vditor from "vditor";
import "vditor/dist/index.css";
import "vditor/dist/index.min";

const NoteContent = ({
  file,
  parentDir
}: {
  file: FileModel;
  parentDir: FileModel | undefined;
}) => {
  useEffect(() => {
    createVidtor({ value: file.content });
  }, [file.path]);

  const createVidtor = params => {
    let { value } = params;
    value = value ? value : " ";
    const vditor = new Vditor("vditor", {
      //Markdown上面的高度,解决点击大纲不跳转问题
      height: document.body.clientHeight - 50,
      mode: "wysiwyg", //及时渲染模式
      icon: "material",
      placeholder: "开始编辑内容...",
      typewriterMode: true,
      counter: {
        enable: true,
        type: "markdown"
      },
      input: (value: string) => file.updateContent(value),
      toolbar: [
        "table",
        "headings",
        "bold",
        "italic",
        "strike",
        "link",
        "|",
        "list",
        "ordered-list",
        "check",
        "outdent",
        "indent",
        "|",
        "quote",
        "line",
        "code",
        "inline-code",
        "insert-before",
        "insert-after",
        "|",
        "outline",
        "export",
        "|",
        "undo",
        "redo",
        "|",
        "fullscreen",
        "edit-mode"
      ],
      after() {
        vditor.setValue(value);
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

  return <div id="vditor" />;
};
export default NoteContent;
