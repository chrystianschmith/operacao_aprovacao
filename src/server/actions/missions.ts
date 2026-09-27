"use server";
import { z } from "zod";
import { ok, type ActionResult, idSchema } from "@/contracts/common";
import type { StudyMissionDTO } from "@/contracts/study-session";
import { toActionError } from "@/server/errors";
import { parseInput } from "@/server/validation";
import {
  getMyMission,
  listMyMissions,
  advanceMyMission,
} from "@/server/services/study-plan/missions";
export async function getMyMissionAction(raw: unknown): Promise<ActionResult<StudyMissionDTO>> {
  try {
    return ok(await getMyMission(parseInput(z.object({ id: idSchema }), raw).id));
  } catch (error) {
    return toActionError(error, "Não foi possível carregar a missão.");
  }
}
export async function listMyMissionsAction(): Promise<ActionResult<StudyMissionDTO[]>> {
  try {
    return ok(await listMyMissions());
  } catch (error) {
    return toActionError(error, "Não foi possível carregar as missões.");
  }
}
export async function advanceMyMissionAction(raw: unknown): Promise<ActionResult<StudyMissionDTO>> {
  try {
    const input = parseInput(
      z.object({ id: idSchema, expectedBlockIndex: z.number().int().min(0) }),
      raw,
    );
    return ok(await advanceMyMission(input.id, input.expectedBlockIndex));
  } catch (error) {
    return toActionError(error, "Não foi possível atualizar a missão.");
  }
}
