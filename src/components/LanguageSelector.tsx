import React from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../hooks/useLanguage';
import { Language } from '../types';

const languages: { code: Language; name: string; flag: string }[] = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳' },
  { code: 'as', name: 'অসমীয়া', flag: '🇮🇳' },
  { code: 'bn', name: 'বাংলা', flag: '🇮🇳' },
  { code: 'mni', name: 'মণিপুরী', flag: '🇮🇳' },
  { code: 'lus', name: 'Mizo', flag: '🇮🇳' },
  { code: 'kha', name: 'Khasi', flag: '🇮🇳' },
  { code: 'nag', name: 'Nagamese', flag: '🇮🇳' },
  { code: 'brx', name: 'बोडो', flag: '🇮🇳' }
];

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();
  const currentLang = languages.find(lang => lang.code === language);

  return (
    <div className="relative">
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as Language)}
        className="appearance-none bg-white/90 backdrop-blur-sm border border-gray-200 rounded-lg px-3 py-2 pr-8 text-sm font-medium text-gray-700 hover:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
      >
        {languages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.flag} {lang.name}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
    </div>
  );
};

export default LanguageSelector;