import { describe, it, expect } from "vitest";
import { generateSlug, normalizeForSlug } from "@/lib/slug";

describe("lib/slug", () => {
  describe("generateSlug", () => {
    it("gera slug normalizado com UUID", () => {
      const slug = generateSlug("Matéria de Teste");
      expect(slug).toMatch(/^materia-de-teste-[a-f0-9-]{36}$/);
    });

    it("remove diacríticos", () => {
      const slug = generateSlug("Matemática");
      expect(slug).toMatch(/^matematica-[a-f0-9-]{36}$/);
    });

    it("remove caracteres especiais", () => {
      const slug = generateSlug("História & Geografia!");
      expect(slug).toMatch(/^historia-geografia-[a-f0-9-]{36}$/);
    });

    it("não adiciona hífen extra nas pontas", () => {
      const slug = generateSlug("  Teste  ");
      expect(slug).toMatch(/^teste-[a-f0-9-]{36}$/);
    });

    it("gera UUIDs diferentes para chamadas diferentes", () => {
      const slug1 = generateSlug("Teste");
      const slug2 = generateSlug("Teste");
      expect(slug1).not.toBe(slug2);
    });
  });

  describe("normalizeForSlug", () => {
    it("normaliza sem UUID", () => {
      const normalized = normalizeForSlug("Matéria de Teste");
      expect(normalized).toBe("materia-de-teste");
    });

    it("remove diacríticos", () => {
      expect(normalizeForSlug("Matemática")).toBe("matematica");
    });

    it("remove caracteres especiais", () => {
      expect(normalizeForSlug("História & Geografia!")).toBe("historia-geografia");
    });

    it("não adiciona hífen extra nas pontas", () => {
      expect(normalizeForSlug("  Teste  ")).toBe("teste");
    });
  });
});