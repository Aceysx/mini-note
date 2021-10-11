import React from "react";

import ListSubheader from "@mui/material/ListSubheader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Collapse from "@mui/material/Collapse";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import SendIcon from "@mui/icons-material/Send";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import { connect } from "umi";
import GlobalModel, { GlobalModelState, SiderbarState } from "@/models/global";
import FileModel from "@/models/file";
import FolderIcon from "@mui/icons-material/Folder";
import FolderOpenIcon from "@mui/icons-material/FolderOpen";

const Sidebar = ({
  siderbarState
}: {
  dispatch: any;
  siderbarState: SiderbarState;
}) => {
  const { rootFile, dirsOpenState } = siderbarState;

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

  const listDirs = (open: boolean, subs: FileModel[], depth: number) => {
    return (
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subs.map(file => {
            const node = (
              <ListItemButton sx={{ pl: depth }} key={file.path}>
                <ListItemIcon>
                  {dirsOpenState[file.path] ? (
                    <FolderOpenIcon />
                  ) : (
                    <FolderIcon />
                  )}
                </ListItemIcon>
                <ListItemText
                  onClick={() => clickDirItem(file)}
                  primary={
                    <span style={{ fontSize: 14 }}>
                      {file.parseDisplayName()}
                    </span>
                  }
                />
              </ListItemButton>
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
        isOpen(rootFile.path),
        subs.filter(item => item.isDir()),
        depth
      );
    }
  };

  return (
    <List
      sx={{ width: "100%", bgcolor: "background.paper" }}
      component="nav"
      aria-labelledby="nested-list-subheader"
      subheader={
        <ListSubheader component="div" style={{ height: 50 }}></ListSubheader>
      }
    >
      <ListItemButton>
        <ListItemIcon>
          <SendIcon />
        </ListItemIcon>
        <ListItemText primary="Dashboard" />
      </ListItemButton>
      <ListItemButton>
        <ListItemIcon>
          <DraftsIcon />
        </ListItemIcon>
        <ListItemText primary="Setting" />
      </ListItemButton>
      <ListItemButton onClick={() => clickDirItem(rootFile)}>
        <ListItemIcon>
          <InboxIcon />
        </ListItemIcon>
        <ListItemText primary="NodeBook" />
        {isOpen(rootFile?.path) ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>

      {renderNoteBook()}
    </List>
  );
};
export default connect(({ global }: { global: GlobalModelState }) => {
  return {
    siderbarState: global.siderbarState
  };
})(Sidebar);
