import React, { useState } from 'react';
import { Box, makeStyles } from '@material-ui/core';
import clsx from 'clsx';
import { NodeProvider, useNode } from '../hooks-providers/node-provider';

const useStyles = makeStyles(() => {
  return {
    root: {
      minHeight: '300px',
      minWidth: '300px',
      backgroundColor: 'white',
      border: `1px solid ${ '#aeaeae' }`,
      margin: '10px',
      transition: 'all .2s ease-in-out',
    },
    hover: {
      backgroundColor: '#f8f8f8',
      transform: 'scale(1.001)',
    },
    active: {
      backgroundColor: '#d2fffb',
      transform: 'scale(1.01)',
    },
  };
});

const LeafResolver = ({ node, setActive, isActive }) => {
  const [ hover, setHover ] = useState(false);

  const onMouseOver = (e) => {
    e.stopPropagation();
    setHover(true);
  };

  const onMouseOut = (e) => {
    e.stopPropagation();
    setHover(false);
  };

  const classes = useStyles();
  return (
    <Box
      id={ node.id }
      component='div'
      onMouseOver={ onMouseOver }
      onMouseOut={ onMouseOut }
      className={ clsx(classes.root, isActive ? classes.active : '', hover ? classes.hover : '') }
      onClick={ (e) => { e.stopPropagation(); return setActive(); } }
    >
      {node.id}
    </Box>
  );
};

const ParentResolver = ({ node, setActive, isActive, children }) => {
  const [ hover, setHover ] = useState(false);

  const onMouseOver = (e) => {
    e.stopPropagation();
    setHover(true);
  };

  const onMouseOut = (e) => {
    e.stopPropagation();
    setHover(false);
  };

  const classes = useStyles();
  return (
    <Box
      id={ node.id }
      component='div'
      onMouseOver={ onMouseOver }
      onMouseOut={ onMouseOut }
      className={ clsx(classes.root, isActive ? classes.active : '', hover ? classes.hover : '') }
      onClick={ (e) => { e.stopPropagation(); return setActive(); } }
    >
      {children}
    </Box>
  );
};

const Node = () => {
  const { node, setActive, isLeaf, isActive } = useNode();

  if (isLeaf) {
    return <LeafResolver node={ node } setActive={ setActive } isActive={ isActive } />;
  }

  return (
    <ParentResolver node={ node } setActive={ setActive } isActive={ isActive }>
      {
        node.nodes.map((childNode) => {
          return (
            <NodeProvider key={ childNode.id } node={ childNode }>
              <Node />
            </NodeProvider>
          );
        })
      }
    </ParentResolver>
  );
};

export default Node;
