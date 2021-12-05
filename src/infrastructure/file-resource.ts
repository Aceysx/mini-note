import { Event } from "../models/event";
import { plainToClass } from "class-transformer";
import FileModel from "@/models/file";

const electron = window.require("electron");
const { ipcRenderer } = electron;

export default class FileResource {
  public static fetchFilesByPath(path: string) {
    let data = FileResource.send(Event.INIT_NOTEBOOK_EVENT, path);
    return plainToClass(FileModel, data);
  }

  static send(event: Event, data: any) {
    return ipcRenderer.sendSync(event, data);
  }

  static fetchFileByPath(path: string) {
    let data = FileResource.send(Event.FETCH_FILE_EVENT, path);
    return plainToClass(FileModel, data);
  }

  static updateFileContent(data: { path: string; content: string }) {
    let file = FileResource.send(Event.MODIFY_FILE_CONTENT, data);
    return plainToClass(FileModel, file);
  }

  static deleteFile(data: { path: string; type: string }) {
    FileResource.send(Event.DELETE_FILE_OR_DIR, data);
  }

  static createFileOrDir(data: { path: string; type: string }) {
    FileResource.send(Event.CREATE_FILE_OR_DIR, data);
  }

  static updateFileName(data: { newFileName: string; oldPath: string }) {
    let file = FileResource.send(Event.MODIFY_FILE_NAME, data);
    return plainToClass(FileModel, file);
  }
}
