import type { Lang } from "../config";
import { es, type Dict } from "./es";
import { en } from "./en";
import { pt } from "./pt";

export type { Dict };

export const DICTS: Record<Lang, Dict> = { es, en, pt };
