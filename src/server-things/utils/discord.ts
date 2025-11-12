import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';

export const getOptionValue = (
  options: APIChatInputApplicationCommandInteractionData['options'],
  name: string
): string => {
  const option = options?.find((opt) => opt.name === name);
  return option && 'value' in option ? String(option.value) : '';
};

const WHITELISTED_ADMIN_IDS = new Set<string>(
  process.env.WHITELISTED_ADMIN_IDS?.split(',').map((id) => id.trim()) || []
);

const WHITELISTED_SUPER_ADMIN_IDS = new Set<string>(
  process.env.WHITELISTED_SUPER_ADMIN_IDS?.split(',').map((id) => id.trim()) ||
    []
);

export const validateAdminId = (id: string | undefined): boolean => {
  if (!id) return false;
  return WHITELISTED_ADMIN_IDS.has(id);
};

export const validateSuperAdminId = (id: string | undefined): boolean => {
  if (!id) return false;
  return WHITELISTED_SUPER_ADMIN_IDS.has(id);
};
