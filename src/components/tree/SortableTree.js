import React, { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  closestCenter,
  defaultDropAnimation,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MeasuringStrategy,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Button } from '@mui/material';

import { sortableTreeKeyboardCoordinates } from './keyboardCoordinates';
import { SortableTreeItem, TreeItem } from './components/TreeItem';
import {
  addItem,
  buildTree,
  flattenTree,
  getChildCount,
  getProjection, ItemTypes,
  removeChildrenOf,
  removeItem,
  setProperty,
} from './utilites';
import { useTree } from '../../hooks-providers/tree-provider';

const measuring = {
  droppable: {
    strategy: MeasuringStrategy.Always,
  },
};

const dropAnimation = {
  ...defaultDropAnimation,
  dragSourceOpacity: 0.5,
};

export function SortableTree({
  collapsible,
  indicator,
  indentationWidth = 50,
  removable,
}) {
  const { items, setItems, selected, setSelected } = useTree();
  const [ activeId, setActiveId ] = useState(null);
  const [ overId, setOverId ] = useState(null);
  const [ offsetLeft, setOffsetLeft ] = useState(0);
  const [ currentPosition, setCurrentPosition ] = useState(null);

  const flattenedItems = useMemo(() => {
    const flattenedTree = flattenTree(items);
    const collapsedItems = flattenedTree.reduce(
      (acc, { children, collapsed, id }) => { return (collapsed && children.length ? [ ...acc, id ] : acc); },
      [],
    );

    return removeChildrenOf(
      flattenedTree,
      activeId ? [ activeId, ...collapsedItems ] : collapsedItems,
    );
  }, [ activeId, items ]);

  const projected = activeId && overId
    ? getProjection(
      flattenedItems,
      activeId,
      overId,
      offsetLeft,
      indentationWidth,
    )
    : null;
  const sensorContext = useRef({
    items: flattenedItems,
    offset: offsetLeft,
  });
  const [ coordinateGetter ] = useState(() => { return sortableTreeKeyboardCoordinates(sensorContext, indentationWidth); });
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    }),
  );

  const sortedIds = useMemo(() => { return flattenedItems.map(({ id }) => { return id; }); }, [
    flattenedItems,
  ]);
  const activeItem = activeId
    ? flattenedItems.find(({ id }) => { return id === activeId; })
    : null;

  useEffect(() => {
    sensorContext.current = {
      items: flattenedItems,
      offset: offsetLeft,
    };
  }, [ flattenedItems, offsetLeft ]);

  const announcements = {
    onDragStart(id) {
      return `Picked up ${ id }.`;
    },
    onDragMove(id, overId_) {
      return getMovementAnnouncement('onDragMove', id, overId_);
    },
    onDragOver(id, overId_) {
      return getMovementAnnouncement('onDragOver', id, overId_);
    },
    onDragEnd(id, overId_) {
      return getMovementAnnouncement('onDragEnd', id, overId_);
    },
    onDragCancel(id) {
      return `Moving was cancelled. ${ id } was dropped in its original position.`;
    },
  };

  console.log(handleSelect, isSelected);
  return (
    <DndContext
      announcements={ announcements }
      sensors={ sensors }
      modifiers={ indicator ? [ adjustTranslate ] : undefined }
      collisionDetection={ closestCenter }
      measuring={ measuring }
      onDragStart={ handleDragStart }
      onDragMove={ handleDragMove }
      onDragOver={ handleDragOver }
      onDragEnd={ handleDragEnd }
      onDragCancel={ handleDragCancel }
    >
      <SortableContext items={ sortedIds } strategy={ verticalListSortingStrategy }>
        <Button onClick={ () => { return handleAdd(); } }>Add</Button>
        {flattenedItems.map(({ id, children, collapsed, depth }) => {
          return (
            <SortableTreeItem
              key={ id }
              id={ id }
              value={ id }
              depth={ id === activeId && projected ? projected.depth : depth }
              indentationWidth={ indentationWidth }
              selected={ isSelected(id) }
              onSelect={ () => { return handleSelect(id); } }
              indicator={ indicator }
              collapsed={ Boolean(collapsed && children.length) }
              onCollapse={
                collapsible && children.length
                  ? () => { return handleCollapse(id); }
                  : undefined
              }
              onRemove={ removable ? () => { return handleRemove(id); } : undefined }
            />
          );
        })}
        {createPortal(
          <DragOverlay dropAnimation={ dropAnimation }>
            {activeId && activeItem ? (
              <TreeItem
                depth={ activeItem.depth }
                clone
                childCount={ getChildCount(items, activeId) + 1 }
                value={ activeId }
                indentationWidth={ indentationWidth }
              />
            ) : null}
          </DragOverlay>,
          document.body,
        )}
      </SortableContext>
    </DndContext>
  );

  function handleDragStart({ active: { id: activeId_ } }) {
    setActiveId(activeId_);
    setOverId(activeId_);

    const activeItem_ = flattenedItems.find(({ id }) => { return id === activeId_; });

    if (activeItem_) {
      setCurrentPosition({
        parentId: activeItem_.parentId,
        overId: activeId_,
      });
    }

    document.body.style.setProperty('cursor', 'grabbing');
  }

  function handleDragMove({ delta }) {
    setOffsetLeft(delta.x);
  }

  function handleDragOver({ over }) {
    setOverId(over?.id ?? null);
  }

  function handleDragEnd({ active, over }) {
    resetState();

    if (projected && over) {
      const { depth, parentId } = projected;
      const clonedItems = JSON.parse(
        JSON.stringify(flattenTree(items)),
      );
      const overIndex = clonedItems.findIndex(({ id }) => { return id === over.id; });
      const activeIndex = clonedItems.findIndex(({ id }) => { return id === active.id; });
      const activeTreeItem = clonedItems[activeIndex];

      clonedItems[activeIndex] = { ...activeTreeItem, depth, parentId };

      const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
      const newItems = buildTree(sortedItems);

      setItems(newItems);
    }
  }

  function handleDragCancel() {
    resetState();
  }

  function resetState() {
    setOverId(null);
    setActiveId(null);
    setOffsetLeft(0);
    setCurrentPosition(null);

    document.body.style.setProperty('cursor', '');
  }

  function handleRemove(id) {
    setItems((items_) => { return removeItem(items_, id); });
  }

  function handleAdd(id) {
    const type = 0.5 > Math.random() ? ItemTypes.Container : ItemTypes.Widget;
    setItems((items_) => { return addItem(items_, id, { type }); });
  }

  function handleSelect(id) {
    setSelected(id);
  }

  function isSelected(id) {
    return id === selected;
  }

  function handleCollapse(id) {
    setItems((items_) => {
      return setProperty(items_, id, 'collapsed', (value) => {
        console.log(value);
        return !value;
      });
    });
  }

  function getMovementAnnouncement(
    eventName,
    activeId_,
    overId_,
  ) {
    if (!overId_ || !projected) {
      return undefined;
    }

    if ('onDragEnd' !== eventName) {
      if (
        currentPosition
          && projected.parentId === currentPosition.parentId
          && overId_ === currentPosition.overId
      ) {
        return undefined;
      }
      setCurrentPosition({
        parentId: projected.parentId,
        overId: overId_,
      });
    }

    const clonedItems = JSON.parse(
      JSON.stringify(flattenTree(items)),
    );
    const overIndex = clonedItems.findIndex(({ id }) => { return id === overId_; });
    const activeIndex = clonedItems.findIndex(({ id }) => { return id === activeId_; });
    const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

    const previousItem = sortedItems[overIndex - 1];

    let announcement;
    const movedVerb = 'onDragEnd' === eventName ? 'dropped' : 'moved';
    const nestedVerb = 'onDragEnd' === eventName ? 'dropped' : 'nested';

    if (!previousItem) {
      const nextItem = sortedItems[overIndex + 1];
      announcement = `${ activeId_ } was ${ movedVerb } before ${ nextItem.id }.`;
    } else if (projected.depth > previousItem.depth) {
      announcement = `${ activeId_ } was ${ nestedVerb } under ${ previousItem.id }.`;
    } else {
      let previousSibling = previousItem;
      while (previousSibling && projected.depth < previousSibling.depth) {
        const { parentId } = previousSibling;
        previousSibling = sortedItems.find(({ id }) => { return id === parentId; });
      }

      if (previousSibling) {
        announcement = `${ activeId_ } was ${ movedVerb } after ${ previousSibling.id }.`;
      }
    }

    return announcement;
  }
}

const adjustTranslate = ({ transform }) => {
  return {
    ...transform,
    y: transform.y - 25,
  };
};
