"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_LANG, STORAGE_KEY, isLang, type Lang } from "./config";
import { es, loadDict, type Dict } from "./dictionaries";

type LangContextValue = {
  lang: Lang;
  dict: Dict;
  setLang: (l: Lang) => void;
};

const LangContext = createContext<LangContextValue>({
  lang: DEFAULT_LANG,
  dict: es,
  setLang: () => {},
});

export function LangProvider({ children }: { children: React.ReactNode }) {
  // SSR y primer render siempre en el idioma por defecto (es) para evitar
  // mismatch de hidratación; si hay preferencia guardada, se aplica en efecto.
  // Idioma y diccionario viajan juntos en un solo estado: el idioma nuevo no se
  // aplica hasta que su diccionario llegó, así nunca hay un render con `lang`
  // en inglés y los textos todavía en español.
  const [state, setState] = useState<{ lang: Lang; dict: Dict }>({ lang: DEFAULT_LANG, dict: es });

  const apply = (l: Lang) => {
    void loadDict(l).then((dict) => setState({ lang: l, dict }));
  };

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (isLang(stored) && stored !== DEFAULT_LANG) apply(stored);
  }, []);

  useEffect(() => {
    document.documentElement.lang = state.lang;
  }, [state.lang]);

  const setLang = (l: Lang) => {
    apply(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* localStorage no disponible — se ignora */
    }
  };

  return (
    <LangContext.Provider value={{ lang: state.lang, dict: state.dict, setLang }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
