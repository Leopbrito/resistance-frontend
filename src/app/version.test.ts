import { describe, expect, it } from "vitest";
import pkg from "../../package.json";
import { APP_VERSION } from "./version";

describe("APP_VERSION", () => {
  it("é uma versão semântica", () => {
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+/);
  });

  it("acompanha a versão do package.json", () => {
    expect(APP_VERSION).toBe(pkg.version);
  });
});
