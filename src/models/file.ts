import FileResource from "@/infrastructure/file-resource";
import {Event, publish} from "@/models/event";
import path from "path";
import {deserializeArray} from "class-transformer";

export enum FileType {dir, file}

export default class FileModel {
  static actionType = 'global/siderbarState'
  path: string;
  createTime: string;
  private readonly sub: FileModel[];
  type: FileType;

  constructor(path: string, createTime: string, sub: FileModel[], type: FileType) {
    this.path = path;
    this.createTime = createTime;
    this.sub = sub;
    this.type = type;
  }

  public getSub(): FileModel[] {
    if (this.sub) {
      return deserializeArray(FileModel, JSON.stringify(this.sub));
    }
    return [];
  }

  public static fetchFilesByPath(path: string) {
    let fileModel = FileResource.fetchFilesByPath(path);
    publish(Event.INIT_NOTEBOOK_EVENT, fileModel)
  }

  public isDir(): boolean {
    return this.type.toString() === FileType[0]
  }

  public parseDisplayName(): string {
    return path.basename(this.path)
  }
}