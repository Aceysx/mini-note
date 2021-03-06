import FileResource from "@/infrastructure/file-resource";
import { Event, publish } from "@/models/event";
import * as PATH from "path";
import { deserializeArray } from "class-transformer";

export enum FileType {
  dir = "dir",
  file = "file"
}

export default class FileModel {
  static actionType = "global/siderbarState";
  sub: FileModel[];
  path: string;
  createTime: string;
  type: FileType;
  content: string | undefined;

  constructor(
    path: string,
    createTime: string,
    sub: FileModel[],
    type: FileType
  ) {
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

  public isDir(): boolean {
    return this.type === FileType.dir;
  }

  public parseDisplayName(): string {
    return PATH.basename(this.path);
  }

  public static fetchFilesByPath(path: string) {
    let fileModel = FileResource.fetchFilesByPath(path);
    publish(Event.INIT_NOTEBOOK_EVENT, fileModel);
  }

  public static fetchEditFile(path: string) {
    let fileModel = FileResource.fetchFileByPath(path);
    publish(Event.FETCH_FILE_EVENT, fileModel);
  }

  public updateContent(newContent: string): void {
    let fileModel = FileResource.updateFileContent({
      path: this.path,
      content: newContent
    });
    publish(Event.FETCH_FILE_EVENT, fileModel);
  }

  public updateFileName(newFileName: string) {
    FileResource.updateFileName({ oldPath: this.path, newFileName });
    publish(Event.MODIFY_FILE_NAME, {});
  }

  public deleteFile() {
    FileResource.deleteFile({ path: this.path, type: this.type.toString() });
    publish(Event.DELETE_FILE_OR_DIR, { filePath: this.path });
  }

  public parseNewFileName(newFileName: string): string {
    return PATH.join(PATH.dirname(this.path), newFileName);
  }

  public hasSameSubFile(filePath: string): boolean {
    return !!this.getSub().find(file => file.path === filePath);
  }

  public static createFile(filePath: string, type: FileType) {
    let fileModel = FileResource.createFileOrDir({
      path: filePath,
      type: type.toString()
    });
    publish(Event.MODIFY_FILE_NAME, fileModel);
  }
}
