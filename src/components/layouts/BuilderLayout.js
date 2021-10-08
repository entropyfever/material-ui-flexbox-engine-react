import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import { Divider } from '@mui/material';

const drawerWidthLeft = 250;
const drawerWidthRight = 300;

export default function Builder(
  {
    leftDrawerProps: {
      toolbarContent: LeftDrawerToolbarContent,
      content: LeftDrawerContent,
    } = {},
    rightDrawerProps: {
      toolbarContent: RightDrawerToolbarContent,
      content: RightDrawerContent,
    } = {},
    toolbarContent: MainToolbarContent,
    content: MainContent,
  },
) {
  return (
    <Box sx={ { display: 'flex' } }>
      <CssBaseline />
      <AppBar
        color='transparent'
        elevation={ 0 }
        position='fixed'
        sx={ { width: `calc(100% - ${ drawerWidthLeft }px - ${ drawerWidthRight }px)`,
          ml: `${ drawerWidthLeft }px`,
          mr: `${ drawerWidthRight }px` } }
      >
        <Toolbar>
          {MainToolbarContent && <MainToolbarContent />}
        </Toolbar>
        <Divider />
      </AppBar>
      <Drawer
        sx={ {
          width: drawerWidthLeft,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidthLeft,
            boxSizing: 'border-box',
          },
          zIndex: 0,
        } }
        variant='permanent'
        anchor='left'
      >
        <Toolbar>
          {LeftDrawerToolbarContent && <LeftDrawerToolbarContent />}
        </Toolbar>
        <Divider />
        {LeftDrawerContent && <LeftDrawerContent />}
      </Drawer>
      <Box
        component='main'
        sx={ { flexGrow: 1, bgcolor: 'background.default', p: 3 } }
      >
        <Toolbar>
          {MainToolbarContent && <MainToolbarContent />}
        </Toolbar>
        {MainContent && <MainContent />}
      </Box>
      <Drawer
        sx={ {
          width: drawerWidthRight,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidthRight,
            boxSizing: 'border-box',
          },
          zIndex: 0,
        } }
        variant='permanent'
        anchor='right'
      >
        <Toolbar>
          {RightDrawerToolbarContent && <RightDrawerToolbarContent />}
        </Toolbar>
        <Divider />
        {RightDrawerContent && <RightDrawerContent />}
      </Drawer>
    </Box>
  );
}
