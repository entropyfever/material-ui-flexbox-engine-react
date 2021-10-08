import React from 'react';
import clsx from 'clsx';
import makeStyles from '@mui/material/styles/makeStyles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useMain } from '../hooks-providers/main-provider';
import useDrag from '../hooks-providers/drag-hook';

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
