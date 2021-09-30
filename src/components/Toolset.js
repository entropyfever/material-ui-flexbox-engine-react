import React from 'react';
import { CardContent, CardHeader, Divider, makeStyles, Typography } from '@material-ui/core';
import Box from '@material-ui/core/Box';
import Card from '@material-ui/core/Card';
import clsx from 'clsx';
import Button from '@material-ui/core/Button';
import useDrag from '../hooks-providers/drag-hook';
import { useMain } from '../hooks-providers/main-provider';

const useStyles = makeStyles((theme) => {
  return {
    toolset: {
      position: 'fixed',
      top: 10,
      right: 10,
      height: 500,
      width: 300,
      zIndex: 9999,
    },
    card: {
      height: '100%',
      overflow: 'hidden',
    },
    drag: {
      cursor: 'pointer',
    },
    header: {
      backgroundColor: theme.palette.light,
    },
  };
});

const Toolset = () => {
  const classes = useStyles();

  const {
    elementRef: toolsetRef,
    onMouseDownHandler: dragMouseDown,
    dragging,
  } = useDrag();

  const {
    activeNodeId,
    addChildToActiveNode,
    clipboardTree,
    pasteClipboard,
  } = useMain();

  return (
    <Box
      component='div'
      ref={ toolsetRef }
      className={ classes.toolset }
    >
      <Card
        className={ classes.card }
        elevation={ dragging ? 12 : 6 }
      >
        <CardHeader
          className={ clsx(classes.header, dragging ? classes.drag : '') }
          onMouseDown={ (e) => {
            dragMouseDown(e);
          } }
          subheader='Toolset'
        />
        <Divider />
        <CardContent>
          <Typography variant='subtitle2'>
            Active node
          </Typography>
          <Typography variant='subtitle1'>
            {activeNodeId}
          </Typography>
        </CardContent>
        <Button
          disabled={ !activeNodeId }
          onClick={ () => { return addChildToActiveNode(); } }
        >
          Add child
        </Button>
        <Button
          onClick={ () => { return clipboardTree(); } }
        >
          Copy json
        </Button>
        <Button
          onClick={ () => { return pasteClipboard(); } }
        >
          Paste json
        </Button>
      </Card>
    </Box>
  );
};

export default Toolset;
