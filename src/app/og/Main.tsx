/** biome-ignore-all lint/a11y/useAltText: og */
/** biome-ignore-all lint/performance/noImgElement: og */
import { fetchNightmareGatewayScores } from '@/handlers/fetch-gateway-scores';
import { fetchActiveNightmareGatewayPeriod } from '@/handlers/fetch-nightmare-period';
import { fetchUsersWithoutScores } from '@/handlers/fetch-users-without-scores';
import { baseFont } from '@/react-things/fonts';

const Main = async () => {
  const activePeriod = await fetchActiveNightmareGatewayPeriod();

  if (!activePeriod) {
    return (
      <div
        className={baseFont.className}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: 'black',
          color: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        Strega Alliance
      </div>
    );
  }

  const [scores, noScoreUsers] = await Promise.all([
    fetchNightmareGatewayScores(activePeriod.id),
    fetchUsersWithoutScores(activePeriod.id)
  ]);

  noScoreUsers.forEach((user) => {
    scores?.push({
      id: `no-score-${user.id}`,
      first_half_score: 0,
      second_half_score: 0,
      user: user
    });
  });

  if (!scores || scores.length <= 3) {
    return (
      <div
        className={baseFont.className}
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          backgroundColor: 'black',
          color: 'black',
          justifyContent: 'center',
          alignItems: 'center',
          gap: '12px'
        }}
      >
        Strega Alliance
      </div>
    );
  }

  return (
    <div
      className={baseFont.className}
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: 'black',
        color: 'black',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '24px'
      }}
    >
      <img
        src={scores[1].user.avatar_url}
        width={128}
        height={128}
        style={{ borderRadius: '50%' }}
      />
      <img
        src={scores[0].user.avatar_url}
        width={128}
        height={128}
        style={{ borderRadius: '50%' }}
      />
      <img
        src={scores[2].user.avatar_url}
        width={128}
        height={128}
        style={{ borderRadius: '50%' }}
      />

      <div
        style={{
          position: 'absolute',
          top: '37%',
          left: '47%',
          transform: 'translate(-50%, -50%) rotate(-27deg)',
          fontSize: '64px'
        }}
      >
        👑
      </div>
    </div>
  );
};

export default Main;
