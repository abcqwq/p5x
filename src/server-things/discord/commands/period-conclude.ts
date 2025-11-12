import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/server-things/discord/types';
import { prisma } from '@/handlers/prisma';
import { validateSuperAdminId } from '@/server-things/utils/discord';
import { formatDate } from '@/react-things/utils/date';

export const register = new SlashCommandBuilder()
  .setName('period-conclude')
  .setDescription(
    'Conclude and freeze the latest period with score snapshots (Super Admin only)'
  );

export const execute: executeCommand = async (interaction) => {
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

  try {
    // Find the latest period with is_frozen=false and lowest number
    const latestUnfrozenPeriod = await prisma.nightmareGatewayPeriod.findFirst({
      where: {
        is_frozen: false
      },
      orderBy: {
        number: 'asc'
      }
    });

    if (!latestUnfrozenPeriod) {
      return {
        type: 4,
        data: {
          content: 'No unfrozen Nightmare Gateway period found.'
        }
      };
    }

    if (latestUnfrozenPeriod.end > new Date()) {
      return {
        type: 4,
        data: {
          content: 'Cannot conclude a period that has not ended yet.'
        }
      };
    }

    const scores = await prisma.nightmareGatewayScore.findMany({
      where: {
        nightmare_id: latestUnfrozenPeriod.id
      },
      include: {
        user: {
          include: {
            companio: true
          }
        }
      }
    });

    const snapshotData = scores.map((score) => ({
      user_id: score.user.id,
      nightmare_period_id: latestUnfrozenPeriod.id,
      discord_username: score.user.discord_username,
      name: score.user.name,
      avatar_url: score.user.avatar_url,
      companio_id: score.user.companio.id,
      companio_name: score.user.companio.name,
      companio_logo_url: score.user.companio.logo_url,
      first_half_score: score.first_half_score,
      second_half_score: score.second_half_score,
      total_score: score.first_half_score + score.second_half_score
    }));

    const result = await prisma.$transaction(async (tx) => {
      await tx.nightmareGatewayScoreSnapshot.deleteMany({
        where: {
          nightmare_period_id: latestUnfrozenPeriod.id
        }
      });

      const snapshotResult = await tx.nightmareGatewayScoreSnapshot.createMany({
        data: snapshotData,
        skipDuplicates: true
      });

      await tx.nightmareGatewayPeriod.update({
        where: {
          id: latestUnfrozenPeriod.id
        },
        data: {
          is_frozen: true
        }
      });

      return snapshotResult;
    });

    return {
      type: 4,
      data: {
        content: `Successfully concluded Nightmare Gateway Period #${latestUnfrozenPeriod.number}!\n\nCreated **${result.count}** score snapshot(s)\n🔒 Period is now frozen\nPeriod: ${formatDate(latestUnfrozenPeriod.start)} - ${formatDate(latestUnfrozenPeriod.end)}`
      }
    };
  } catch (error) {
    console.error('Error concluding period:', error);
    return {
      type: 4,
      data: {
        content:
          'An error occurred while concluding the period. Please try again later or contact an administrator.'
      }
    };
  }
};
