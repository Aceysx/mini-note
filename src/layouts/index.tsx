import React, {useEffect} from "react";
import "../global.less";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import Sidebar from "@/layouts/sidebar";
import MessageBody from "@/components/common/message-body";
import OpenFileModel from "@/components/common/message-body";
import GlobalModel from "@/models/global";
import {RightContent} from "./right-content";
import CssBaseline from '@material-ui/core/CssBaseline';
import Toolbar from '@material-ui/core/Toolbar';
import Layout, {
  getContent,
  getDrawerSidebar,
  getHeader,
  getSidebarContent,
  getSidebarTrigger,
  Root,
} from '@mui-treasury/layout';
import {alpha, styled} from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import SearchIcon from '@mui/icons-material/Search';

const Header = getHeader(styled);
const DrawerSidebar = getDrawerSidebar(styled);
const SidebarTrigger = getSidebarTrigger(styled);
const SidebarContent = getSidebarContent(styled);
const Content = getContent(styled);

const Search = styled('div')(({theme}) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.black, 0.05),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.black, 0.1),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({theme}) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({theme}) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

export default function () {
  useEffect(() => {
    GlobalModel.dispatch.notebook();
  }, []);

  const scheme = Layout();

  scheme.configureHeader(builder => {
    builder.registerConfig('xs', {
      position: 'relative',
      clipped: false,
    });
  });

  scheme.configureEdgeSidebar(builder => {
    builder
      .create('primarySidebar', {anchor: 'left'})
      .registerPersistentConfig('xs', {
        width: 300,
        collapsible: false,
        persistentBehavior: {
          header: 'fit',
          _other: 'none'
        }
      });
  });
  return (
    <Root initialState={{sidebar: {primarySidebar: {open: true}}}}
          scheme={scheme}>
      {({setOpen}) => (
        <>
          <CssBaseline/>
          <Header color={'white'}>
            <Toolbar>
              <SidebarTrigger
                sidebarId={'primarySidebar'}/>

                <Search>
                <SearchIconWrapper>
                  <SearchIcon/>
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search File"
                  inputProps={{'aria-label': 'search'}}
                />
              </Search>

            </Toolbar>
          </Header>
          <DrawerSidebar
            sidebarId={'primarySidebar'}
          >
            <SidebarContent>
              <Sidebar/>
            </SidebarContent>
          </DrawerSidebar>

          <Content>
            <RightContent/>
          </Content>
          <MessageBody/>
          <OpenFileModel/>
        </>
      )}
    </Root>

    // <Grid container className="container">
    //   <Grid item xs={2} style={{ background: "#fafafa" }}>
    //     <Sidebar />
    //   </Grid>
    //   <Grid item xs={10} className={"bg-white"}>
    //     <Content />
    //   </Grid>
    //   <MessageBody />
    //   <OpenFileModel />
    // </Grid>
  );
}
