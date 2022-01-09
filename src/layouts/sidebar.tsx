import React, { useState } from "react";
import List from "@mui/material/List";
import { connect } from "umi";
import GlobalModel, { GlobalModelState, SiderbarState } from "@/models/global";
import FileModel, { FileType } from "@/models/file";
import FolderIcon from "@mui/icons-material/Folder";
import MenuItem from "@mui/material/MenuItem";
import { useJupiterNestedMenuStyles } from "@mui-treasury/styles/nestedMenu/gatsby";
import NestedMenu from "@mui-treasury/components/menu/nested";
import { useFadedShadowStyles } from "@mui-treasury/styles/shadow/faded";

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

  const clickDirItem = (file: FileModel | undefined) => {
    if (file) {
      GlobalModel.dispatch.siderbarState({
        currentSelectedDirFile: file
      });
    }
  };

  const clickCreateFileOrDirMenu = (type: FileType) => {
    const { file } = contextMenu;
    handleClose();
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

  const getSubMenus = (parentFile: FileModel) => {
    const dirMenus: [] = [],
      files: [] = [];
    parentFile.getSub().forEach(item => {
      if (item.isDir()) {
        const isEmpty = item.getSub().length === 0;

        const dirComponent = (
          <span
            onContextMenu={e => handleContextMenu(e, parentFile, item)}
            style={{ width: "100%" }}
            onClick={() => clickDirItem(item)}
          >
            <FolderIcon style={{ position: "absolute", fontSize: "1.2em" }} />
            <span style={{ paddingLeft: "25px" }}>
              {item.parseDisplayName()}
            </span>
          </span>
        );
        if (isEmpty) {
          dirMenus.push({
            key: item.path,
            label: dirComponent
          });
        } else {
          dirMenus.push({
            key: item.path,
            label: dirComponent,
            subMenus: getSubMenus(item)
          });
        }
      } else {
        const component = (
          <span
            style={{ width: "100%" }}
            onContextMenu={e => handleContextMenu(e, item, item)}
            onClick={() => FileModel.fetchEditFile(item.path)}
          >
            {item.parseDisplayName()}
          </span>
        );
        files.push({ key: item.path, label: component });
      }
    });
    return [...dirMenus, ...files];
  };

  const render = () => {
    const data = [];
    if (rootFile && rootFile.isDir()) {
      const item = (
        <span style={{ width: "100%" }} onClick={() => clickDirItem(rootFile)}>
          {rootFile.parseDisplayName()}
        </span>
      );

      const root = {
        key: rootFile.path,
        label: item,
        subMenus: getSubMenus(rootFile)
      };
      data.push(root);
    }
    return data;
  };
  return (
    <List
      sx={{
        width: "100%",
        paddingTop: "50px!important",
        height: document.body.clientHeight,
        overflowY: "scroll"
      }}
      className={"layout_scroll_hide"}
      component="nav"
      aria-labelledby="nested-list-subheader"
    >
      <NestedMenu
        openKeys={dirsOpenState}
        onOpenKeysChange={key => {
          if (key[0] && !dirsOpenState.includes(key[0])) {
            GlobalModel.dispatch.siderbarState({
              dirsOpenState: [...dirsOpenState, key[0]]
            });
          }
        }}
        menus={render()}
        useStyles={useJupiterNestedMenuStyles}
      />

      <Menu
        open={contextMenu !== null}
        onClose={handleClose}
        keepMounted
        anchorReference="anchorPosition"
        aria-haspopup="true"
        style={useFadedShadowStyles()}
        anchorPosition={
          contextMenu !== null
            ? {
                top: contextMenu.position.mouseY,
                left: contextMenu.position.mouseX
              }
            : undefined
        }
      >
        <MenuItem onClick={() => clickEditFileOrDirMenu()}>
          <div>Edit</div>
        </MenuItem>
        <MenuItem
          onClick={() => {
            setDeleteFile(contextMenu.file);
            handleClose();
          }}
        >
          <div>Delete</div>
        </MenuItem>

        <MenuItem
          disabled={!(contextMenu && contextMenu.file.isDir())}
          onClick={() => {
            clickCreateFileOrDirMenu(FileType.file);
          }}
        >
          <div>New File</div>
        </MenuItem>
        <MenuItem
          disabled={!(contextMenu && contextMenu.file.isDir())}
          onClick={() => {
            clickCreateFileOrDirMenu(FileType.dir);
          }}
        >
          <div>New Directory</div>
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
