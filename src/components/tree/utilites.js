import { arrayMove } from '@dnd-kit/sortable';
import { v4 as uuid } from 'uuid';

export const ItemTypes = {
  Container: 'Container',
  Widget: 'Widget',
};

export const iOS = /iPad|iPhone|iPod/.test(navigator.platform);

function getDragDepth(offset, indentationWidth) {
  return Math.round(offset / indentationWidth);
}

export function getProjection(
  items,
  activeId,
  overId,
  dragOffset,
  indentationWidth,
) {
  const overItemIndex = items.findIndex(({ id }) => { return id === overId; });
  const activeItemIndex = items.findIndex(({ id }) => { return id === activeId; });
  const activeItem = items[activeItemIndex];
  const newItems = arrayMove(items, activeItemIndex, overItemIndex);
  const previousItem = newItems[overItemIndex - 1];
  const nextItem = newItems[overItemIndex + 1];
  const dragDepth = getDragDepth(dragOffset, indentationWidth);
  const projectedDepth = activeItem.depth + dragDepth;
  const maxDepth = getMaxDepth({
    previousItem,
  });
  const minDepth = getMinDepth({ nextItem });
  let depth = projectedDepth;

  if (projectedDepth >= maxDepth) {
    depth = maxDepth;
  } else if (projectedDepth < minDepth) {
    depth = minDepth;
  }

  return { depth, maxDepth, minDepth, parentId: getParentId() };

  function getParentId() {
    if (0 === depth || !previousItem) {
      return null;
    }

    if (depth === previousItem.depth) {
      return previousItem.parentId;
    }

    if (depth > previousItem.depth) {
      return previousItem.id;
    }

    const newParent = newItems
      .slice(0, overItemIndex)
      .reverse()
      .find((item) => { return item.depth === depth; })?.parentId;

    return newParent ?? null;
  }
}

function getMaxDepth({ previousItem }) {
  if (!previousItem) {
    return 0;
  }

  switch (previousItem.type) {
    case ItemTypes.Container:
      return previousItem.depth + 1;
    case ItemTypes.Widget:
      return previousItem.depth;
    default:
      return previousItem.depth;
  }
}

function getMinDepth({ nextItem }) {
  if (nextItem) {
    return nextItem.depth;
  }

  return 0;
}

function flatten(
  items,
  parentId = null,
  depth = 0,
) {
  return items.reduce((acc, item, index) => {
    return [
      ...acc,
      { ...item, parentId, depth, index },
      ...flatten(item.children, item.id, depth + 1),
    ];
  }, []);
}

export function flattenTree(items) {
  return flatten(items);
}

export function buildTree(flattenedItems) {
  const root = { id: 'root', children: [] };
  const nodes = { [root.id]: root };
  const items = flattenedItems.map((item) => { return { ...item, children: [] }; });

  items.forEach((item) => {
    const { id, children } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, children };
    parent.children.push(item);
  });

  return root.children;
  /*
  for (const item of items) {
    const { id, children } = item;
    const parentId = item.parentId ?? root.id;
    const parent = nodes[parentId] ?? findItem(items, parentId);

    nodes[id] = { id, children };
    parent.children.push(item);
  }

  return root.children;

   */
}

export function findItem(items, itemId) {
  return items.find(({ id }) => { return id === itemId; });
}

export function findItemDeep(
  items,
  itemId,
) {
  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    const { id, children } = item;

    if (id === itemId) {
      return item;
    }

    if (children.length) {
      const child = findItemDeep(children, itemId);

      if (child) {
        return child;
      }
    }
  }

  return undefined;
}

export function removeItem(items, id) {
  const newItems = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const item of items) {
    if (item.id === id) {
      // eslint-disable-next-line no-continue
      continue;
    }

    if (item.children.length) {
      item.children = removeItem(item.children, id);
    }

    newItems.push(item);
  }

  return newItems;
}

export function addItem(items, id, itemProps) {
  if (!id) {
    return [
      ...items,
      {
        ...itemProps,
        id: `${ (itemProps && itemProps.type) ? itemProps.type : 'unknown' }-${ uuid().slice(0, 5) }`,
        children: [],
      },
    ];
  }

  throw new Error('Not implemented yet');
}

export function setProperty(
  items,
  id,
  property,
  setter,
) {
  return [
    ...items.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [property]: setter(item[property]),
        };
      }
      if (!item.children.length) {
        return item;
      }
      const children = setProperty(item.children, id, property, setter);
      return {
        ...item,
        children,
      };
    }),
  ];

  /*
  for (const item of items) {
    if (item.id === id) {
      item[property] = setter(item[property]);
      continue;
    }

    if (item.children.length) {
      item.children = setProperty(item.children, id, property, setter);
    }
  }
   return [ ...items ];
  */
}

function countChildren(items, count = 0) {
  return items.reduce((acc, { children }) => {
    if (children.length) {
      return countChildren(children, acc + 1);
    }

    return acc + 1;
  }, count);
}

export function getChildCount(items, id) {
  if (!id) {
    return 0;
  }

  const item = findItemDeep(items, id);

  return item ? countChildren(item.children) : 0;
}

export function removeChildrenOf(items, ids) {
  const excludeParentIds = [ ...ids ];

  return items.filter((item) => {
    if (item.parentId && excludeParentIds.includes(item.parentId)) {
      if (item.children.length) {
        excludeParentIds.push(item.id);
      }
      return false;
    }

    return true;
  });
}
