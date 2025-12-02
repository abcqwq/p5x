import { SlashCommandBuilder } from '@discordjs/builders';
import type { executeCommand } from '@/server-things/discord/types';
import { fetchActiveNightmareGatewayPeriod } from '@/handlers/fetch-nightmare-period';
import { fetchUsersWithoutScores } from '@/handlers/fetch-users-without-scores';
import { validateAdminId, getOptionValue } from '@/server-things/utils/discord';
import type { APIChatInputApplicationCommandInteractionData } from 'discord-api-types/v10';

export const register = new SlashCommandBuilder()
  .setName('show-no-scores')
  .setDescription(
    'Show users who have not scored in the current period (Admin only)'
  )
  .addBooleanOption((option) =>
    option
      .setName('tag_user')
      .setDescription('Whether to tag the users in the response')
      .setRequired(true)
  );

export const execute: executeCommand = async (interaction) => {
  const data =
    interaction.data as APIChatInputApplicationCommandInteractionData;

  const executorId = interaction.member?.user.id;
  if (!validateAdminId(executorId)) {
    return {
      type: 4,
      data: {
        content: 'You do not have permission to use this command.'
      }
    };
  }

  const tagUser = getOptionValue(data.options, 'tag_user');

  if (tagUser === null || tagUser === undefined) {
    return {
      type: 4,
      data: {
        content: 'tag_user parameter is required.'
      }
    };
  }

  try {
    const activePeriod = await fetchActiveNightmareGatewayPeriod();

    if (!activePeriod) {
      return {
        type: 4,
        data: {
          content:
            'No active Nightmare Gateway period found. Please contact an administrator.'
        }
      };
    }

    const usersWithoutScores = await fetchUsersWithoutScores(activePeriod.id);

    if (usersWithoutScores.length === 0) {
      return {
        type: 4,
        data: {
          content: 'All users have scored! 🎉'
        }
      };
    }

    // Group users by companio
    const usersByCompanio = usersWithoutScores.reduce(
      (acc, user) => {
        const companioName = user.companio?.name || 'Unknown';
        if (!acc[companioName]) {
          acc[companioName] = [];
        }
        acc[companioName].push(user);
        return acc;
      },
      {} as Record<string, typeof usersWithoutScores>
    );

    let content = `**Users who haven't scored (${usersWithoutScores.length} total):**\n\n`;

    Object.entries(usersByCompanio).forEach(([companioName, users]) => {
      content += `**${companioName}** (${users.length})\n`;
      if (tagUser.toLowerCase() === 'true') {
        content += users
          .map((user) => `<@${user.id}> - ${user.name}`)
          .join('\n');
      } else {
        content += users.map((user) => `${user.name}`).join('\n');
      }
      content += '\n\n';
    });

    return {
      type: 4,
      data: {
        content
      }
    };
  } catch (error) {
    console.error('Error fetching users without scores:', error);
    return {
      type: 4,
      data: {
        content:
          'An error occurred while fetching users. Please try again later or contact an administrator.'
      }
    };
  }
};
