import React from 'react';
import { makeStyles } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import { MainProvider } from '../hooks-providers/main-provider';
import Main from './Main';
import useDrag from '../hooks-providers/drag-hook';

const useStyles = makeStyles((theme) => {
  return {
    toolset: {
      position: 'absolute',
      top: 10,
      right: 10,
      height: 500,
      width: 300,
      zIndex: 9999,
    },
    paper: {
      height: '100%',
      overflow: 'hidden',
    },
    header: {
      height: '40px',
      width: '100%',
      backgroundColor: theme.palette.primary.main,
      color: 'white',
    },
  };
});

const Toolset = () => {
  const classes = useStyles();

  const { elementRef: toolsetRef, onMouseDownHandler: dragMouseDown } = useDrag();

  return (
    <Box
      component='div'
      ref={ toolsetRef }
      className={ classes.toolset }
    >
      <Paper className={ classes.paper }>
        <Box
          component='div'
          className={ classes.header }
          onMouseDown={ (e) => {
            dragMouseDown(e);
          } }
        >
          Toolset
        </Box>
      </Paper>
    </Box>
  );
};

const Engine = () => {
  return (
    <MainProvider>
      <Main />
      <Toolset />
    </MainProvider>
  );
};

export default Engine;
