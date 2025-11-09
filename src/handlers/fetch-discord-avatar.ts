import { REST } from 'discord.js';

/**
 * Fetch Discord avatar URL for a single user using Discord REST API
 * @param userId - Discord user ID
 * @param token - Discord bot token (optional, uses env if not provided)
 * @returns Avatar URL or null if user not found
 */
export async function fetchDiscordAvatar(
  userId: string,
  token?: string
): Promise<string | null> {
  try {
    const botToken = token || process.env.DISCORD_TOKEN;

    if (!botToken) {
      throw new Error('Discord token not provided');
    }

    const rest = new REST({ version: '10' }).setToken(botToken);

    // Fetch user data from Discord API
    const user = (await rest.get(`/users/${userId}`)) as {
      id: string;
      username: string;
      discriminator: string;
      avatar: string | null;
    };

    // If user has no avatar, return null
    if (!user.avatar) {
      return null;
    }

    // Construct avatar URL
    const extension = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${extension}`;
  } catch (error) {
    console.error(`Failed to fetch avatar for user ${userId}:`, error);
    return null;
  }
}

/**
 * Fetch Discord avatar URLs for multiple users
 * @param userIds - Array of Discord user IDs
 * @param token - Discord bot token (optional, uses env if not provided)
 * @returns Map of userId to avatar URL (or null if not found)
 */
export async function fetchDiscordAvatars(
  userIds: string[]
): Promise<Map<string, string | null>> {
  const results = new Map<string, string | null>();

  // Fetch avatars in parallel
  const promises = userIds.map(async (userId) => {
    const avatarUrl = await fetchDiscordAvatar(
      userId,
      process.env.DISCORD_TOKEN
    );
    results.set(userId, avatarUrl);
  });

  await Promise.all(promises);
  return results;
}

/**
 * Get avatar URL with size parameter
 * @param userId - Discord user ID
 * @param size - Avatar size (16, 32, 64, 128, 256, 512, 1024, 2048, 4096)
 * @param token - Discord bot token (optional, uses env if not provided)
 * @returns Avatar URL with size parameter or null
 */
export async function fetchDiscordAvatarWithSize(
  userId: string,
  size: 16 | 32 | 64 | 128 | 256 | 512 | 1024 | 2048 | 4096 = 256,
  token?: string
): Promise<string | null> {
  const baseUrl = await fetchDiscordAvatar(userId, token);

  if (!baseUrl) {
    return null;
  }

  return `${baseUrl}?size=${size}`;
}

/**
 * Get default Discord avatar URL for users without custom avatars
 * @param userId - Discord user ID
 * @param discriminator - User discriminator (for legacy users) or username
 * @returns Default avatar URL
 */
export function getDefaultDiscordAvatar(
  userId: string,
  discriminator?: string
): string {
  // For new username system (discriminator === '0' or undefined)
  // Use (user_id >> 22) % 6 to determine avatar index
  if (!discriminator || discriminator === '0') {
    const avatarIndex = (BigInt(userId) >> BigInt(22)) % BigInt(6);
    return `https://cdn.discordapp.com/embed/avatars/${avatarIndex}.png`;
  }

  // For legacy discriminator system
  const avatarIndex = parseInt(discriminator) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${avatarIndex}.png`;
}
