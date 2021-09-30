import React from 'react';
import { useMain } from '../hooks-providers/main-provider';
import { NodeProvider } from '../hooks-providers/node-provider';
import Node from './Node';

const Main = () => {
  const { tree } = useMain();

  return (
    <NodeProvider node={ tree.root }>
      <Node />
    </NodeProvider>
  );
};

export default Main;
