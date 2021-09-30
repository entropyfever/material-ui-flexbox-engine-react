import React, { createContext, useContext, useEffect, useState } from 'react';
import { findNodeById, generateId } from '../components/utils';
import { example } from '../example';

const MainContext = createContext({});

export const MainProvider = (
  {
    children,
  },
) => {
  const [ tree, setTree ] = useState(example);

  const [ activeNodeId, setActiveNodeId ] = useState(null);

  const setNodeById = (nodeId, cb) => {
    setTree((prevTree) => {
      const node = findNodeById(prevTree.root, nodeId);
      Object.assign(node, 'function' === typeof cb ? cb(node) : cb);
      return prevTree;
    });
  };

  const setActiveNode = (nodeId) => {
    return setActiveNodeId(nodeId);
  };

  useEffect(() => {
    console.log('active node id', activeNodeId);
  }, [ activeNodeId ]);

  const addChildToNode = (nodeId) => {
    const id = generateId();
    setTree((prevTree) => {
      const node = findNodeById(prevTree.root, nodeId);
      if (!node.nodes || !node.nodes.length) {
        node.nodes = [{ id }];
      } else {
        node.nodes.append({ id });
      }
    });
  };

  const addChildToActiveNode = () => {
    return addChildToNode(activeNodeId);
  };

  const ctx = {
    tree,
    setNodeById,
    addChildToNode,
    activeNodeId,
    setActiveNodeId,
    setActiveNode,
    addChildToActiveNode,
  };

  return (
    <MainContext.Provider value={ ctx }>
      {children}
    </MainContext.Provider>
  );
};

export const useMain = () => {
  const {
    tree,
    setNodeById,
    addChildToNode,
    activeNodeId,
    setActiveNodeId,
    setActiveNode,
    addChildToActiveNode,
  } = useContext(MainContext);

  return {
    tree,
    setNodeById,
    addChildToNode,
    activeNodeId,
    setActiveNodeId,
    setActiveNode,
    addChildToActiveNode,
  };
};
