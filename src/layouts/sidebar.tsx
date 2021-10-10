import React from 'react';

import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import DraftsIcon from '@mui/icons-material/Drafts';
import SendIcon from '@mui/icons-material/Send';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import {connect} from 'umi';
import {GlobalModelState, SiderbarState} from '@/models/global';
import FileModel from "@/models/file";
import FolderIcon from '@mui/icons-material/Folder';
import FolderOpenIcon from '@mui/icons-material/FolderOpen';

const Sidebar = ({dispatch, siderbarState}: { dispatch: any, siderbarState: SiderbarState }) => {
  const [open, setOpen] = React.useState(true);
  const handleClick = () => {
    setOpen(!open);
  };

  const clickDirItem = (file: FileModel) => {
    const oldState = siderbarState.dirsOpenState
    dispatch({
      type: FileModel.actionType,
      dirsOpenState: {...oldState, [file.path]: !oldState[file.path]}
    })
  }
  const renderNoteBook = () => {
    let rootFile = siderbarState.rootFile;
    let dirsOpenState = siderbarState.dirsOpenState;

    if (rootFile && rootFile.isDir()) {
      let subs = rootFile.getSub().filter((file: FileModel, i, o) => {
        return file.isDir()
      });

      return <List component="div" disablePadding>
        {
          subs.map(file => <ListItemButton sx={{pl: 3}} key={file.path}>
            <ListItemIcon>
              {
                dirsOpenState[file.path]
                  ? <FolderOpenIcon/>
                  : <FolderIcon/>
              }
            </ListItemIcon>
            <ListItemText
              onClick={() => clickDirItem(file)}
              primary={<span style={{fontSize: 14}}>{file.parseDisplayName()}</span>}/>
          </ListItemButton>)
        }
      </List>;
    }
  }

  return <List
    sx={{width: '100%', maxWidth: 360, bgcolor: 'background.paper'}}
    component="nav"
    aria-labelledby="nested-list-subheader"
    subheader={
      <ListSubheader component="div" style={{height: 50}}>
      </ListSubheader>
    }>
    <ListItemButton>
      <ListItemIcon>
        <SendIcon/>
      </ListItemIcon>
      <ListItemText primary="Dashboard"/>
    </ListItemButton>
    <ListItemButton>
      <ListItemIcon>
        <DraftsIcon/>
      </ListItemIcon>
      <ListItemText primary="Setting"/>
    </ListItemButton>
    <ListItemButton onClick={handleClick}>
      <ListItemIcon>
        <InboxIcon/>
      </ListItemIcon>
      <ListItemText primary="NodeBook"/>
      {open ? <ExpandLess/> : <ExpandMore/>}
    </ListItemButton>
    <Collapse in={open} timeout="auto" unmountOnExit>
      {
        renderNoteBook()
      }

    </Collapse>
  </List>
}
export default connect(({global}: { global: GlobalModelState }) => {
  return ({
    siderbarState: global.siderbarState
  })
})(Sidebar)

