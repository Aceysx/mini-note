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
import { Input, Menu } from "@mui/material";
import _ from "path";

const Sidebar = ({
  siderbarState
}: {
  dispatch: any;
  siderbarState: SiderbarState;
}) => {
  const { rootFile, dirsOpenState } = siderbarState;
  const [currentCreateActionFile, setCurrentCreateActionFile] = useState<
    | {
        parentFile: FileModel;
        currentFileName: string;
        type: FileType;
      }
    | undefined
  >(undefined);

  const [contextMenu, setContextMenu] = React.useState<{
    position: {
      mouseX: number;
      mouseY: number;
    };
    file: FileModel;
  } | null>(null);

  const handleContextMenu = (event: React.MouseEvent, file: FileModel) => {
    event.preventDefault();
    setContextMenu(
      contextMenu === null
        ? {
            position: {
              mouseY: event.clientY - 4,
              mouseX: event.clientX - 2
            },
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

  const creatFile = (fileName: string) => {
    const { parentFile, type } = currentCreateActionFile;
    const newFilePath = _.join(parentFile.path, fileName);
    if (parentFile.hasSameSubFile(newFilePath)) {
      return GlobalModel.dispatch.message({
        severity: "error",
        isOpen: true,
        message: `${fileName} is exist in this directory`
      });
    }
    console.log(newFilePath);
    FileModel.createFile(newFilePath, type);
    GlobalModel.dispatch.message({
      severity: "info",
      isOpen: true,
      message: `create file success`
    });
    setCurrentCreateActionFile(undefined);
  };

  const listDirs = (open: boolean, subs: FileModel[], depth: number) => {
    return (
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subs.map(file => {
            let subFiles = file.getSub().filter(item => !item.isDir());

            const node = (
              <div>
                <ListItemButton
                  sx={{ pl: depth }}
                  key={file.path}
                  onClick={() => clickDirItem(file)}
                  onContextMenu={e => handleContextMenu(e, file)}
                  style={{ cursor: "context-menu" }}
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
                  <MenuItem onClick={handleClose}>Edit</MenuItem>
                  <MenuItem onClick={handleClose}>Delete</MenuItem>

                  <MenuItem
                    onClick={() => {
                      const { file } = contextMenu;
                      handleClose();
                      GlobalModel.dispatch.siderbarState({
                        dirsOpenState: { ...dirsOpenState, [file.path]: true }
                      });
                      setCurrentCreateActionFile({
                        parentFile: file,
                        currentFileName: "Untitled.md",
                        type: FileType.file
                      });
                    }}
                  >
                    New File
                  </MenuItem>
                  <MenuItem onClick={handleClose}>New Directory</MenuItem>
                </Menu>
                {currentCreateActionFile &&
                currentCreateActionFile.parentFile.path === file.path ? (
                  <Input
                    autoFocus={true}
                    defaultValue={currentCreateActionFile.currentFileName}
                    style={{ marginLeft: (depth + 2) * 8 }}
                    onKeyUp={e => {
                      if (e.keyCode === 13) {
                        creatFile(e.target.value);
                      }
                    }}
                    inputProps={{ "aria-label": "description" }}
                  />
                ) : (
                  ""
                )}

                {isOpen(file.path)
                  ? subFiles.map(item => (
                      <ListItemButton sx={{ pl: depth + 2 }} key={item.path}>
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
                  {listDirs(isOpen(file.path), subDirs, depth + 2)}
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
        true,
        subs.filter(item => item.isDir()),
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
      {/*<ListItemButton>*/}
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
      {/*  <ListItemText primary="NodeBook" />*/}
      {/*  {isOpen(rootFile?.path) ? <ExpandLess /> : <ExpandMore />}*/}
      {/*</ListItemButton>*/}

      {renderNoteBook()}
    </List>
  );
};
export default connect(({ global }: { global: GlobalModelState }) => {
  return {
    siderbarState: global.siderbarState
  };
})(Sidebar);
