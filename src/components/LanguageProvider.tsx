// src/components/LanguageProvider.tsx
import React, { createContext, ReactNode } from 'react';

export const LanguageContext = createContext({ language: 'en' });

interface Props {
  children: ReactNode;
}

export const LanguageProvider: React.FC<Props> = ({ children }) => {
  return (
    <LanguageContext.Provider value={{ language: 'en' }}>
      {children}
    </LanguageContext.Provider>
  );
};
