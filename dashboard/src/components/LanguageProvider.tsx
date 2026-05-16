import React, { ReactNode } from 'react';
import { LanguageContext, useLanguageProvider } from '../hooks/useLanguage';

interface Props {
  children: ReactNode;
}

export const LanguageProvider: React.FC<Props> = ({ children }) => {
  const value = useLanguageProvider();
  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};
