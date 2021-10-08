import React from 'react';
import { useTree } from '../../hooks-providers/tree-provider';
import Resolver from './Resolver';

const TreeRenderer = () => {
  const { items } = useTree();

  return <Resolver items={ items } />;
};

export default TreeRenderer;
