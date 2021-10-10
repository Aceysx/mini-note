import { Event } from "../models/event";

const electron = window.require("electron");
const { ipcRenderer } = electron;
import { plainToClass } from "class-transformer";
import FileModel from "@/models/file";

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
}
