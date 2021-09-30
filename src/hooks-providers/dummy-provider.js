/**
 * This is meant to be a code template
 * Do not change it or use it unless you are me
 * However, you can copy and paste it, change the "dummy" name to your preference
 * and don't forget to have fun !
 * Last but not least, try not to useDummy() outside of <DummyProvider />, it would be dummy to do so
 */
import React, { createContext, useContext, useState } from 'react';

const DummyContext = createContext({});

export const DummyProvider = (
  {
    children,
  },
) => {
  const [ dummy, setDummy ] = useState(null);
  const ctx = {
    dummy,
    setDummy,
  };

  return (
    <DummyContext.Provider value={ ctx }>
      {children}
    </DummyContext.Provider>
  );
};

export const useDummy = () => {
  const {
    dummy,
    setDummy,
  } = useContext(DummyContext);

  return {
    dummy,
    setDummy,
  };
};
