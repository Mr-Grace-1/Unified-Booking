import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Check } from 'lucide-react';
import { useI18n } from '../store/I18nContext';

export default function LanguageSwitcher() {
  const { language, setLanguage, availableLanguages } = useI18n();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = availableLanguages.find(l => l.code === language);

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
      >
        <Globe size={18} className="text-slate-400" />
        <span className="text-sm text-slate-300">{currentLang?.flag} {currentLang?.code.toUpperCase()}</span>
      </motion.button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 top-12 w-56 bg-slate-900 border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            <div className="p-2">
              {availableLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-all ${
                    language === lang.code
                      ? 'bg-indigo-500/20 text-indigo-300'
                      : 'text-slate-300 hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="text-sm font-medium">{lang.name}</span>
                  </div>
                  {language === lang.code && <Check size={16} className="text-indigo-400" />}
                </button>
              ))}
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}
