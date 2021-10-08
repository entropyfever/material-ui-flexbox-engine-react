import React, { useState } from 'react';
import Box from '@mui/material/Box';
import { NodeProvider, useNode } from '../hooks-providers/node-provider';

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

  return (
    <Box
      id={ node.id }
      component='div'
      onMouseOver={ onMouseOver }
      onMouseOut={ onMouseOut }
      sx={ {
        minHeight: '300px',
        minWidth: '300px',
        backgroundColor: 'white',
        border: `1px solid ${ '#aeaeae' }`,
        margin: '10px',
        transition: 'all .2s ease-in-out',
        ...(hover) && {
          backgroundColor: '#f8f8f8',
          transform: 'scale(1.001)',
        },
        ...isActive && {
          backgroundColor: '#d2fffb',
          transform: 'scale(1.01)',
        },

      } }
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

  return (
    <Box
      id={ node.id }
      component='div'
      onMouseOver={ onMouseOver }
      onMouseOut={ onMouseOut }
      sx={ {
        minHeight: '300px',
        minWidth: '300px',
        backgroundColor: 'white',
        border: `1px solid ${ '#aeaeae' }`,
        margin: '10px',
        transition: 'all .2s ease-in-out',
        ...(hover) && {
          backgroundColor: '#f8f8f8',
          transform: 'scale(1.001)',
        },
        ...isActive && {
          backgroundColor: '#d2fffb',
          transform: 'scale(1.01)',
        },

      } }
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
