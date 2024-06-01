import { createContext, useState } from 'react';

export const SidemenuContext = createContext();

export const SidemenuProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOpen = () => {
    setIsOpen((prevIsOpen) => !prevIsOpen);
  };

  return (
    <SidemenuContext.Provider value={{ isOpen, toggleOpen }}>
      {children}
    </SidemenuContext.Provider>
  );
};

export default SidemenuContext;