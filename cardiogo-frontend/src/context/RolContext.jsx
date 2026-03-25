import React, { createContext, useState } from 'react';

export const RolContext = createContext();

export const RolProvider = ({ children }) => {
  const [rol, setRol] = useState(null);

  return (
    <RolContext.Provider value={{ rol, setRol }}>
      {children}
    </RolContext.Provider>
  );
};
