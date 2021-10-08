/**
 * This is meant to be a code template
 * Do not change it or use it unless you are me
 * However, you can copy and paste it, change the "dummy" name to your preference
 * and don't forget to have fun !
 * Last but not least, try not to useDummy() outside of <DummyProvider />, it would be dummy to do so
 */
import React, { createContext, useContext, useState } from 'react';

const TreeContext = createContext({});

export const TreeProvider = (
  {
    children,
  },
) => {
  const [ items, setItems ] = useState([]);
  const [ selected, setSelected ] = useState(null);
  const ctx = {
    items,
    setItems,
    selected,
    setSelected,
  };

  return (
    <TreeContext.Provider value={ ctx }>
      {children}
    </TreeContext.Provider>
  );
};

export const useTree = () => {
  const {
    items,
    setItems,
    selected,
    setSelected,
  } = useContext(TreeContext);

  return {
    items,
    setItems,
    selected,
    setSelected,
  };
};
