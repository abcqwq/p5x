import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/server-things/discord/types';
import { prisma } from '@/handlers/prisma';
import {
  validateSuperAdminId,
  getOptionValue
} from '@/server-things/utils/discord';
import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';
import { formatDate } from '@/react-things/utils/date';
import { STREGA_URL_MESSAGE } from '@/server-things/utils/base-responses';

export const register = new SlashCommandBuilder()
  .setName('period-setup')
  .setDescription('Create a new Nightmare Gateway period (Super Admin only)')
  .addStringOption((option) =>
    option
      .setName('first_half_boss_name')
      .setDescription('First half boss name')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('first_half_boss_type')
      .setDescription('First half boss type')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('second_half_boss_name')
      .setDescription('Second half boss name')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('second_half_boss_type')
      .setDescription('Second half boss type')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('start_date')
      .setDescription('Start date (ISO format: YYYY-MM-DDTHH:MM:SSZ)')
      .setRequired(true)
  )
  .addStringOption((option) =>
    option
      .setName('end_date')
      .setDescription('End date (ISO format: YYYY-MM-DDTHH:MM:SSZ)')
      .setRequired(true)
  );

export const execute: executeCommand = async (interaction) => {
  const data =
    interaction.data as APIChatInputApplicationCommandInteractionData;

  const executorId = interaction.member?.user.id;
  if (!validateSuperAdminId(executorId)) {
    return {
      type: 4,
      data: {
        content:
          'You do not have permission to use this command. Super Admin access required.'
      }
    };
  }

  const firstHalfBossName = getOptionValue(
    data.options,
    'first_half_boss_name'
  );
  const firstHalfBossType = getOptionValue(
    data.options,
    'first_half_boss_type'
  );
  const secondHalfBossName = getOptionValue(
    data.options,
    'second_half_boss_name'
  );
  const secondHalfBossType = getOptionValue(
    data.options,
    'second_half_boss_type'
  );
  const startDateStr = getOptionValue(data.options, 'start_date');
  const endDateStr = getOptionValue(data.options, 'end_date');

  if (
    !firstHalfBossName ||
    !firstHalfBossType ||
    !secondHalfBossName ||
    !secondHalfBossType ||
    !startDateStr ||
    !endDateStr
  ) {
    return {
      type: 4,
      data: {
        content: 'All fields are required.'
      }
    };
  }

  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return {
      type: 4,
      data: {
        content:
          'Invalid date format. Please use ISO format (YYYY-MM-DDTHH:MM:SSZ).'
      }
    };
  }

  if (startDate >= endDate) {
    return {
      type: 4,
      data: {
        content: 'Start date must be before end date.'
      }
    };
  }

  try {
    const latestPeriod = await prisma.nightmareGatewayPeriod.findFirst({
      orderBy: {
        number: 'desc'
      }
    });

    if (latestPeriod && startDate <= latestPeriod.end) {
      return {
        type: 4,
        data: {
          content: `Start date must be after the end date of the latest period (Period #${latestPeriod.number}, ends at ${latestPeriod.end.toISOString()}).`
        }
      };
    }

    const newPeriod = await prisma.nightmareGatewayPeriod.create({
      data: {
        start: startDate,
        end: endDate,
        first_half_boss_name: firstHalfBossName,
        first_half_boss_type: firstHalfBossType,
        first_half_boss_avatar_url: `/assets/${firstHalfBossName.toLocaleLowerCase()}.png`,
        second_half_boss_name: secondHalfBossName,
        second_half_boss_type: secondHalfBossType,
        second_half_boss_avatar_url: `/assets/${secondHalfBossName.toLocaleLowerCase()}.png`
      }
    });

    return {
      type: 4,
      data: {
        content: `Nightmare Gateway Period #${newPeriod.number} has been created successfully!\n\n**Details:**\n- First Half: **${firstHalfBossName}** (${firstHalfBossType})\n- Second Half: **${secondHalfBossName}** (${secondHalfBossType})\n- Start: ${formatDate(startDate)}\n- End: ${formatDate(endDate)}${STREGA_URL_MESSAGE}`
      }
    };
  } catch (error) {
    console.error('Error creating Nightmare Gateway period:', error);
    return {
      type: 4,
      data: {
        content:
          'An error occurred while creating the period. Please check the logs or contact an administrator.'
      }
    };
  }
};
