import React, { useState } from "react";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import { connect } from "umi";
import GlobalModel, { GlobalModelState, SiderbarState } from "@/models/global";
import FileModel, { FileType } from "@/models/file";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";
import MenuItem from "@mui/material/MenuItem";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  TextField
} from "@mui/material";
import _ from "path";

const Sidebar = ({
  siderbarState
}: {
  dispatch: any;
  siderbarState: SiderbarState;
}) => {
  const { rootFile, dirsOpenState } = siderbarState;
  const [deleteFile, setDeleteFile] = useState<FileModel | undefined>(
    undefined
  );
  const [currentActionFile, setCurrentActionFile] = useState<
    | {
        parentFile: FileModel;
        currentFile: FileModel | undefined;
        type: FileType;
        action: "create" | "edit";
        tempName: string | undefined;
      }
    | undefined
  >(undefined);

  const [currentCreateActionFile, setCurrentCreateActionFile] = useState<
    | {
        parentFile: FileModel;
        currentFileName: string;
        type: FileType;
      }
    | undefined
  >(undefined);

  const [currentEditActionFile, setCurrentEditActionFile] = useState<
    | {
        parentFile: FileModel;
        file: FileModel;
        currentFileName: string;
      }
    | undefined
  >(undefined);

  const [contextMenu, setContextMenu] = React.useState<{
    position: {
      mouseX: number;
      mouseY: number;
    };
    parentFile: FileModel;
    file: FileModel;
  } | null>(null);

  const handleContextMenu = (
    event: React.MouseEvent,
    parentFile: FileModel,
    file: FileModel
  ) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            position: {
              mouseY: event.clientY - 4,
              mouseX: event.clientX - 2
            },
            parentFile,
            file
          }
        : null
    );
    return false;
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const isOpen = (path: string): boolean => {
    // @ts-ignore
    return dirsOpenState[path];
  };

  const clickDirItem = (file: FileModel | undefined) => {
    if (file) {
      GlobalModel.dispatch.siderbarState({
        dirsOpenState: { ...dirsOpenState, [file.path]: !isOpen(file.path) },
        currentSelectedDirFile: file
      });
    }
  };

  const clickCreateFileOrDirMenu = (type: FileType) => {
    const { file } = contextMenu;
    handleClose();
    GlobalModel.dispatch.siderbarState({
      dirsOpenState: { ...dirsOpenState, [file.path]: true }
    });
    setCurrentActionFile({
      parentFile: file,
      currentFile: undefined,
      tempName: `Untitled${type === FileType.dir ? "" : ".md"}`,
      type,
      action: "create"
    });
  };

  const clickEditFileOrDirMenu = () => {
    const { parentFile, file } = contextMenu;
    handleClose();
    setCurrentActionFile({
      parentFile,
      currentFile: file,
      tempName: file.parseDisplayName(),
      type: file.type,
      action: "edit"
    });
  };

  const createOrEditFile = () => {
    // @ts-ignore
    const {
      tempName,
      parentFile,
      currentFile,
      type,
      action
    } = currentActionFile;
    if (action === "create") {
      creatFile(tempName, parentFile, type);
    } else if (action === "edit") {
      editFile(tempName, parentFile, currentFile);
    }
    setCurrentActionFile(undefined);
  };

  const creatFile = (
    fileName: string,
    parentFile: FileModel,
    type: FileType
  ) => {
    const newFilePath = _.join(parentFile.path, fileName);
    if (parentFile.hasSameSubFile(newFilePath)) {
      return GlobalModel.dispatch.message({
        severity: "error",
        isOpen: true,
        message: `${fileName} is exist in this directory`
      });
    }
    FileModel.createFile(newFilePath, type);
    GlobalModel.dispatch.message({
      severity: "info",
      isOpen: true,
      message: `create file success`
    });
    setCurrentCreateActionFile(undefined);
  };

  const editFile = (
    fileName: string,
    parentFile: FileModel,
    file: FileModel
  ) => {
    const newFilePath = file.parseNewFileName(fileName);
    if (parentFile.hasSameSubFile(newFilePath)) {
      return GlobalModel.dispatch.message({
        severity: "error",
        isOpen: true,
        message: `${fileName} is exist in this directory`
      });
    }

    file.updateFileName(fileName);
    GlobalModel.dispatch.message({
      severity: "info",
      isOpen: true,
      message: `edit file success`
    });
    setCurrentEditActionFile(undefined);
  };

  const listDirs = (
    parentFile: FileModel,
    open: boolean,
    subs: FileModel[],
    depth: number
  ) => {
    return (
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subs.map(file => {
            let subFiles = file.getSub().filter(item => !item.isDir());
            const node = (
              <div>
                <ListItemButton
                  onContextMenu={e => handleContextMenu(e, parentFile, file)}
                  style={{ cursor: "context-menu" }}
                  sx={{ pl: depth }}
                  key={file.path}
                  onClick={() => clickDirItem(file)}
                >
                  <ListItemIcon>
                    {dirsOpenState[file.path] ? (
                      <FolderOpenIcon />
                    ) : (
                      <FolderIcon />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <span style={{ fontSize: 14 }}>
                        {file.parseDisplayName()}
                      </span>
                    }
                  />
                </ListItemButton>

                {isOpen(file.path)
                  ? subFiles.map(item => (
                      <ListItemButton
                        onContextMenu={e => handleContextMenu(e, file, item)}
                        style={{ cursor: "context-menu" }}
                        sx={{ pl: depth + 2 }}
                        key={item.path}
                      >
                        <ListItemText
                          onClick={() => FileModel.fetchEditFile(item.path)}
                          primary={
                            <span style={{ fontSize: 14 }}>
                              {item.parseDisplayName()}
                            </span>
                          }
                        />
                      </ListItemButton>
                    ))
                  : ""}
              </div>
            );

            let subDirs = file.getSub().filter(item => item.isDir());
            if (subDirs.length > 0) {
              return (
                <Collapse in={open} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {node}
                  </List>
                  {listDirs(file, isOpen(file.path), subDirs, depth + 2)}
                </Collapse>
              );
            }
            return node;
          })}
        </List>
      </Collapse>
    );
  };

  const renderNoteBook = () => {
    const depth = 3;
    if (rootFile && rootFile.isDir()) {
      let subs = rootFile.getSub().filter((file: FileModel, i, o) => {
        return file.isDir();
      });

      return listDirs(
        // isOpen(rootFile.path),
        rootFile,
        true,
        subs,
        depth
      );
    }
  };

  return (
    <List
      sx={{
        width: "100%",
        paddingTop: "50px",
        height: document.body.clientHeight,
        overflowY: "scroll"
      }}
      className={"layout_scroll_hide"}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <ListItemButton
        onContextMenu={e => handleContextMenu(e, rootFile, rootFile)}
      >
        {/*  <ListItemIcon>*/}
        {/*    <SendIcon />*/}
        {/*  </ListItemIcon>*/}
        {/*  <ListItemText primary="Dashboard" />*/}
        {/*</ListItemButton>*/}
        {/*<ListItemButton>*/}
        {/*  <ListItemIcon>*/}
        {/*    <DraftsIcon />*/}
        {/*  </ListItemIcon>*/}
        {/*  <ListItemText primary="Setting" />*/}
        {/*</ListItemButton>*/}
        {/*<ListItemButton onClick={() => clickDirItem(rootFile)}>*/}
        {/*  <ListItemIcon>*/}
        {/*    <InboxIcon />*/}
        {/*  </ListItemIcon>*/}
        <ListItemIcon>
          {rootFile && dirsOpenState[rootFile.path] ? (
            <FolderOpenIcon />
          ) : (
            <FolderIcon />
          )}
        </ListItemIcon>
        <ListItemText primary={rootFile && rootFile.parseDisplayName()} />
      </ListItemButton>
      {renderNoteBook()}
      {rootFile &&
        rootFile
          .getSub()
          .filter(item => !item.isDir())
          .map(file => (
            <ListItemButton
              onContextMenu={e => handleContextMenu(e, rootFile, file)}
              style={{ cursor: "context-menu" }}
              sx={{ pl: 3 }}
              key={file.path}
              onClick={() => FileModel.fetchEditFile(file.path)}
            >
              <ListItemText
                primary={
                  <span style={{ fontSize: 14 }}>
                    {file.parseDisplayName()}
                  </span>
                }
              />
            </ListItemButton>
          ))}
      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        aria-haspopup="true"
        anchorPosition={
          contextMenu !== null
            ? {
                top: contextMenu.position.mouseY,
                left: contextMenu.position.mouseX
              }
            : undefined
        }
      >
        <MenuItem onClick={() => clickEditFileOrDirMenu()}>Edit</MenuItem>
        <MenuItem
          onClick={() => {
            setDeleteFile(contextMenu.file);
            handleClose();
          }}
        >
          Delete
        </MenuItem>

        <MenuItem
          disabled={!(contextMenu && contextMenu.file.isDir())}
          onClick={() => {
            clickCreateFileOrDirMenu(FileType.file);
          }}
        >
          New File
        </MenuItem>
        <MenuItem
          disabled={!(contextMenu && contextMenu.file.isDir())}
          onClick={() => {
            clickCreateFileOrDirMenu(FileType.dir);
          }}
        >
          New Directory
        </MenuItem>
      </Menu>

      <Dialog
        open={!!currentActionFile}
        onClose={() => setCurrentActionFile(undefined)}
      >
        <DialogTitle>
          File {currentActionFile && currentActionFile.action}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="fileName"
            value={currentActionFile && currentActionFile.tempName}
            onChange={e =>
              setCurrentActionFile({
                ...currentActionFile,
                tempName: e.target.value
              })
            }
            type="text"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCurrentActionFile(undefined)}>
            Cancel
          </Button>
          <Button onClick={createOrEditFile}>Confirm</Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!deleteFile}
        onClose={() => setDeleteFile(undefined)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure want to delete this file[
            {deleteFile?.parseDisplayName()}]?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteFile(undefined)}>Cancel</Button>
          <Button
            onClick={() => {
              deleteFile && deleteFile.deleteFile();
              setDeleteFile(undefined);
            }}
            autoFocus
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </List>
  );
};
export default connect(({ global }: { global: GlobalModelState }) => {
  return {
    siderbarState: global.siderbarState
  };
})(Sidebar);
