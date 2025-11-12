import { number, z } from 'zod';

export const CompanioSchema = z.object({
  id: z.string(),
  logo_url: z.string(),
  name: z.string()
});

export const UserSchema = z.object({
  id: z.string(),
  name: z.string(),
  avatar_url: z.string(),
  discord_username: z.string(),
  companio: CompanioSchema
});

export const NightmareGatewayScoreSchema = z.object({
  id: z.string(),
  first_half_score: z.bigint().transform((val) => Number(val)),
  second_half_score: z.bigint().transform((val) => Number(val)),
  user: UserSchema
});

export const NightmareGatewayPeriodSchema = z.object({
  id: z.string(),
  start: z.date(),
  end: z.date(),
  number: z.number().int(),
  first_half_boss_name: z.string(),
  first_half_boss_type: z.string(),
  first_half_boss_avatar_url: z.string(),
  second_half_boss_name: z.string(),
  second_half_boss_type: z.string(),
  second_half_boss_avatar_url: z.string()
});

export const CompanioPeriodMinimumScoreSchema = z.object({
  id: z.string(),
  companio_id: z.string(),
  nightmare_period_id: z.string(),
  minimum_score: z.bigint().transform((val) => Number(val)),
  companio: CompanioSchema
});

export type Companios = z.infer<typeof CompanioSchema>[];

export type NightmareGatewayScore = z.infer<typeof NightmareGatewayScoreSchema>;

export type NightmareGatewayScores = z.infer<
  typeof NightmareGatewayScoreSchema
>[];

export type NightmareGatewayPeriod = z.infer<
  typeof NightmareGatewayPeriodSchema
>;

export type NightmareGatewayPeriods = z.infer<
  typeof NightmareGatewayPeriodSchema
>[];

export type CompanioPeriodMinimumScore = z.infer<
  typeof CompanioPeriodMinimumScoreSchema
>;

export type CompanioPeriodMinimumScores = z.infer<
  typeof CompanioPeriodMinimumScoreSchema
>[];
