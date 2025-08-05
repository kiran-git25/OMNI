import { createContext } from 'react';

export const FileContext = createContext({
  currentFile: null,
  setCurrentFile: () => {}
});

export const FileProvider = ({ children }) => {
  const [currentFile, setCurrentFile] = useState(null);
  
  return (
    <FileContext.Provider value={{ currentFile, setCurrentFile }}>
      {children}
    </FileContext.Provider>
  );
};
