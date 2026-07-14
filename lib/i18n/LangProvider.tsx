"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LANG, STORAGE_KEY, isLang, type Lang } from "./config";

type LangContextValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
};

const LangContext = createContext<LangContextValue>({
  lang: DEFAULT_LANG,
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  // SSR y primer render siempre en el idioma por defecto (es) para evitar
  // mismatch de hidratación; si hay preferencia guardada, se aplica en efecto.
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLang(stored) && stored !== DEFAULT_LANG) setLangState(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* localStorage no disponible — se ignora */
    }
  };

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
