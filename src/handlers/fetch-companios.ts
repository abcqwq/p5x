import { prisma } from '@/handlers/prisma';
import {
  type Companios,
  CompanioSchema
} from '@/bridge-things/schemas/nightmare-gateway';

export async function fetchCompanios(): Promise<Companios | null> {
  const companios = await prisma.companio.findMany({});

  if (!companios) return null;

  const parsed = CompanioSchema.array().parse(companios);
  return parsed;
}
