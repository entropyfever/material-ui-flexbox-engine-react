import React, { createContext, useContext, useState } from 'react';
import { findNodeById, generateId } from '../components/utils';
import { example } from '../example';

const MainContext = createContext({});

export const MainProvider = (
  {
    children,
  },
) => {
  const [ tree, setTree ] = useState(example);

  const treeToString = () => {
    return JSON.stringify(tree);
  };

  const stringToTree = (str) => {
    return JSON.parse(str);
  };

  const clipboardTree = async () => {
    const str = treeToString();
    await navigator.clipboard.writeText(str);
  };

  const pasteClipboard = async () => {
    navigator.clipboard.readText().then((data) => {
      setTree(stringToTree(data));
    });
  };

  const [ activeNodeId, setActiveNodeId ] = useState(null);

  const setNodeById = (nodeId, cb) => {
    setTree((prevTree) => {
      const node = findNodeById(prevTree.root, nodeId);
      Object.assign(node, 'function' === typeof cb ? cb(node) : cb);
      const newTree = { ...prevTree };
      return newTree;
    });
  };

  const setActiveNode = (nodeId) => {
    return setActiveNodeId(nodeId);
  };

  const addChildToNode = (nodeId) => {
    const id = generateId();
    setTree((prevTree) => {
      const node = findNodeById(prevTree.root, nodeId);
      if (!node.nodes || !node.nodes.length) {
        node.nodes = [{ id }];
      } else {
        node.nodes.push({ id });
      }
      const newTree = { ...prevTree };
      return newTree;
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
    clipboardTree,
    pasteClipboard,
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
    clipboardTree,
    pasteClipboard,
  } = useContext(MainContext);

  return {
    tree,
    setNodeById,
    addChildToNode,
    activeNodeId,
    setActiveNodeId,
    setActiveNode,
    addChildToActiveNode,
    clipboardTree,
    pasteClipboard,
  };
};
