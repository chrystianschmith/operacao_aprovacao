"use server";
import { z } from "zod";
import { ok, type ActionResult } from "@/contracts/common";
import { toActionError } from "@/server/errors";
import { parseInput } from "@/server/validation";
import { searchMyContent, type SearchPageDTO } from "@/server/services/navigation/search";
export async function searchContentAction(raw: unknown): Promise<ActionResult<SearchPageDTO>> {
  try {
    const input = parseInput(
      z.object({
        query: z.string().trim().min(2, "Digite pelo menos 2 caracteres.").max(100),
        page: z.coerce.number().int().min(1).max(10000).default(1),
      }),
      raw,
    );
    return ok(await searchMyContent(input.query, input.page));
  } catch (error) {
    return toActionError(error, "Não foi possível realizar a busca.");
  }
}
