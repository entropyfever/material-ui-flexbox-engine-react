import React, { createContext, useContext } from 'react';
import { useMain } from './main-provider';

const NodeContext = createContext({});

export const NodeProvider = (
  {
    node,
    children,
  },
) => {
  const {
    setNodeById,
    addChildToNode,
    setActiveNode,
    activeNodeId,
  } = useMain();

  const setNode = (v) => {
    return setNodeById(node.id, v);
  };

  const addChild = () => {
    return addChildToNode(node.id);
  };

  const setActive = () => {
    return setActiveNode(node.id);
  };

  const ctx = {
    node,
    setNode,
    addChild,
    setActive,
    activeNodeId,
  };

  return (
    <NodeContext.Provider value={ ctx }>
      {children}
    </NodeContext.Provider>
  );
};

export const useNode = () => {
  const {
    node,
    setNode,
    addChild,
    setActive,
    activeNodeId,
  } = useContext(NodeContext);

  const isLeaf = !node.nodes || !node.nodes.length || 0 === node.nodes.length;
  const isActive = activeNodeId === node.id;

  return {
    node,
    setNode,
    addChild,
    setActive,
    isLeaf,
    isActive,
  };
};
