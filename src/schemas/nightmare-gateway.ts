import { z } from 'zod';

export const CompanioSchema = z.object({
  id: z.string(),
  logo_url: z.string(),
  name: z.string()
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar_url: z.string(),
  companio: CompanioSchema
});

export const NightmareGatewayScoreSchema = z.object({
  id: z.string(),
  first_half_score: z.number().int(),
  second_half_score: z.number().int(),
  user: UserSchema
});

export const NightmareGatewayPeriodSchema = z.object({
  id: z.string(),
  start: z.date(),
  end: z.date(),
  first_half_boss_name: z.string(),
  first_half_boss_avatar_url: z.string(),
  second_half_boss_name: z.string(),
  second_half_boss_avatar_url: z.string(),
  nightmare_gateway_scores: z.array(NightmareGatewayScoreSchema)
});

export type NightmareGatewayPeriodWithScores = z.infer<
  typeof NightmareGatewayPeriodSchema
>;
