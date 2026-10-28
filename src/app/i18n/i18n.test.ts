import { describe, expect, it } from "vitest";
import en from "./locales/en.json";
import ptBR from "./locales/pt-BR.json";

type Tree = { [key: string]: string | Tree };

const flatten = (tree: Tree, prefix = ""): Record<string, string> =>
  Object.entries(tree).reduce<Record<string, string>>((acc, [key, value]) => {
    const path = prefix ? `${prefix}.${key}` : key;
    return typeof value === "string"
      ? { ...acc, [path]: value }
      : { ...acc, ...flatten(value, path) };
  }, {});

// Sufixos de plural variam por idioma (pt-BR também usa _many em alguns casos), então comparamos a base
const base = (key: string) => key.replace(/_(zero|one|two|few|many|other)$/, "");
const placeholders = (text: string) =>
  [...text.matchAll(/{{\s*(\w+)\s*}}/g)].map((m) => m[1]).sort();

const enFlat = flatten(en as Tree);
const ptFlat = flatten(ptBR as Tree);

describe("locales", () => {
  it("pt-BR has the same keys as en", () => {
    const enKeys = new Set(Object.keys(enFlat).map(base));
    const ptKeys = new Set(Object.keys(ptFlat).map(base));
    expect([...enKeys].filter((k) => !ptKeys.has(k))).toEqual([]);
    expect([...ptKeys].filter((k) => !enKeys.has(k))).toEqual([]);
  });

  it("pt-BR keeps the same interpolation placeholders as en", () => {
    Object.entries(enFlat).forEach(([key, text]) => {
      if (ptFlat[key] === undefined) return;
      expect({ key, vars: placeholders(ptFlat[key]) }).toEqual({ key, vars: placeholders(text) });
    });
  });

  it("translates plurals and params in both languages", async () => {
    const { default: i18n } = await import("./index");
    await i18n.changeLanguage("pt-BR");
    expect(i18n.t("lobby.playerCount", { count: 1, max: 10 })).toBe("1 / 10 Jogador");
    expect(i18n.t("lobby.playerCount", { count: 7, max: 10 })).toBe("7 / 10 Jogadores");
    expect(i18n.t("errors.ROOM_FULL", { max: 10 })).toContain("10");
    await i18n.changeLanguage("en");
    expect(i18n.t("lobby.playerCount", { count: 1, max: 10 })).toBe("1 / 10 Player");
  });

  it("falls back to en for unsupported languages and pt-BR for other Portuguese", async () => {
    const { default: i18n } = await import("./index");
    await i18n.changeLanguage("fr");
    expect(i18n.t("home.createRoom")).toBe("Create Room");
    await i18n.changeLanguage("pt-PT");
    expect(i18n.t("home.createRoom")).toBe("Criar Sala");
  });
});
