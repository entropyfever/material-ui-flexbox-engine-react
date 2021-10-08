import React from 'react';

const Wrapper = ({ children }) => {
  return (
    <div
      style={ {
        padding: 10,
        margin: '0 auto',
        marginTop: '10%',
        height: 300,
        overflow: 'scroll',
      } }
    >
      {children}
    </div>
  );
};

export default Wrapper;
