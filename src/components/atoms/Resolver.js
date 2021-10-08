import React from 'react';
import { ItemTypes } from '../tree/utilites';
import LayoutContainer from './LayoutContainer';
import WidgetContainer from './WidgetContainer';

const Resolver = (
  {
    items,
  },
) => {
  if (!items.length) {
    return null;
  }
  return (
    <>
      { items.map((item) => {
        const { id, type, styles, children } = item;

        switch (type) {
          case ItemTypes.Container:
            return (
              <LayoutContainer
                isLeaf={ !children.length }
                styles={ styles }
              >
                <Resolver items={ children } />
              </LayoutContainer>
            );
          case ItemTypes.Widget:
            return (
              <WidgetContainer
                styles={ styles }
                widget={ () => {
                  return (
                    <p>
                      I am a widget of
                      {id}
                    </p>
                  );
                } }
              />
            );
          default:
            return null;
        }
      }) }
    </>
  );
};

export default Resolver;
