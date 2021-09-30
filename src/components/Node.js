import React from 'react';
import { Box } from '@material-ui/core';
import { NodeProvider, useNode } from '../hooks-providers/node-provider';

const Resolver = ({ node, setActive }) => {
  return (
    <Box
      component='div'
      onClick={ () => { return setActive(); } }
      style={ { minHeight: '300px', minWidth: '300px', border: '1px solid black' } }
    >
      {node.id}
    </Box>
  );
};

const Node = () => {
  const { node, setActive, isLeaf } = useNode();

  if (isLeaf) {
    return <Resolver node={ node } setActive={ setActive } />;
  }

  return (
    <>
      {
        node.nodes.map((childNode) => {
          return (
            <NodeProvider key={ childNode.id } node={ childNode }>
              <Node />
            </NodeProvider>
          );
        })
      }
    </>
  );
};

export default Node;
