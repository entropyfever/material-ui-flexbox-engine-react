import { v4 as uuid } from 'uuid';

export const generateId = () => {
  return uuid();
};

export const treeTraversal = (root, fn, childrenKey = 'children') => {
  const aux = (p) => {
    if (fn(p)) {
      return p;
    }
    const children = p[childrenKey];

    if (!children || !children.length) {
      return undefined;
    }

    return children.find((child) => { return fn(aux(child)); });
  };

  return aux(root);
};

export const findNodeById = (root, nodeId) => {
  return treeTraversal(root, (node) => { return node.id === nodeId; }, 'nodes');
};
