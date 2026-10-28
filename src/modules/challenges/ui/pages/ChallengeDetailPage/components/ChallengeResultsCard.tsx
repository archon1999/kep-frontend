import { useTranslation } from 'react-i18next';
import { Box, Stack, Typography } from '@mui/material';
import { Challenge, ChallengeStatus } from 'modules/challenges/domain';
import ChallengeUserChip from 'modules/challenges/ui/shared/components/ChallengeUserChip';
import ChallengeChip, { ChallengeChipTone } from 'shared/components/challenges/ChallengeChip';

interface ResultsCardProps {
  challenge: Challenge;
  compact?: boolean;
}
const mapResultTone = (value: number): ChallengeChipTone =>
  value === 1 ? 'win' : value === -1 ? 'draw' : 'loss';
const ChallengeResultsCard = ({ challenge, compact = false }: ResultsCardProps) => {
  const { t, i18n } = useTranslation();
  const finished = challenge.status === ChallengeStatus.Finished;
  const players = [challenge.playerFirst, challenge.playerSecond];
  const getResultTitle = (value: number) =>
    t(
      value === 1
        ? 'challenges.answerCorrect'
        : value === 0
          ? 'challenges.answerWrong'
          : finished
            ? 'challenges.answerNotPlayed'
            : 'challenges.answerPending',
    );
  return (
    <Box sx={{ minWidth: 0 }}>
      {compact ? (
        <Stack direction="column" gap={2}>
          <Typography component="h2" variant="subtitle2" color="text.secondary">
            {t('challenges.matchScore')}
          </Typography>
          {players.map((player, index) => (
            <Stack
              key={index}
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={2}
            >
              <Stack gap={0.5} sx={{ minWidth: 0 }}>
                <ChallengeUserChip player={player} />
                <Typography variant="caption" color="text.secondary">
                  {player.rating.toLocaleString(i18n.language, { maximumFractionDigits: 1 })}
                </Typography>
              </Stack>
              <Typography variant="metric" sx={{ fontSize: 32 }}>
                {player.result}
              </Typography>
            </Stack>
          ))}
        </Stack>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) auto minmax(0, 1fr)',
            gap: { xs: 1.5, sm: 3 },
            alignItems: 'center',
          }}
        >
          {players.map((player, index) => (
            <Stack
              key={index}
              gap={1}
              sx={{ minWidth: 0, gridColumn: index === 0 ? 1 : 3, gridRow: 1 }}
            >
              <ChallengeUserChip
                player={{
                  ...player,
                  rankTitle: finished ? player.newRankTitle || player.rankTitle : player.rankTitle,
                }}
                align={index === 0 ? 'left' : 'right'}
              />
              <Stack
                direction="row"
                gap={1}
                flexWrap="wrap"
                useFlexGap
                justifyContent={index === 0 ? 'flex-start' : 'flex-end'}
              >
                <Typography
                  variant="caption"
                  color="text.secondary"
                  title={t('challenges.table.rating')}
                >
                  {(finished ? player.newRating : player.rating).toLocaleString(i18n.language, {
                    maximumFractionDigits: 1,
                  })}
                </Typography>
                {finished && (
                  <Typography
                    variant="caption"
                    fontWeight={700}
                    title={t('challenges.statisticsPage.history.ratingChange')}
                    color={
                      player.delta > 0
                        ? 'success.main'
                        : player.delta < 0
                          ? 'error.main'
                          : 'text.secondary'
                    }
                  >
                    {player.delta.toLocaleString(i18n.language, {
                      maximumFractionDigits: 1,
                      signDisplay: 'exceptZero',
                    })}
                  </Typography>
                )}
              </Stack>
            </Stack>
          ))}
          <Stack direction="row" gap={1.5} alignItems="center" sx={{ gridColumn: 2, gridRow: 1 }}>
            <Typography
              variant="metric"
              sx={{ fontSize: { xs: 32, sm: 48 } }}
              color={
                finished && players[0].result > players[1].result ? 'success.main' : 'text.primary'
              }
            >
              {players[0].result}
            </Typography>
            <Typography component="span" variant="h6" color="text.disabled">
              :
            </Typography>
            <Typography
              variant="metric"
              sx={{ fontSize: { xs: 32, sm: 48 } }}
              color={
                finished && players[1].result > players[0].result ? 'success.main' : 'text.primary'
              }
            >
              {players[1].result}
            </Typography>
          </Stack>
        </Box>
      )}
      <Box sx={{ mt: 2.5, overflowX: 'auto' }}>
        <Box
          component="table"
          aria-label={t('challenges.questions')}
          sx={{
            width: '100%',
            minWidth: (compact ? 80 : 120) + challenge.questionsCount * (compact ? 22 : 36),
            borderCollapse: 'collapse',
            '& th, & td': {
              p: compact ? 0.25 : 0.75,
              textAlign: 'center',
              borderTop: 1,
              borderColor: 'divider',
            },
            '& th:first-of-type': { textAlign: 'left', width: compact ? 80 : 120, fontWeight: 500 },
          }}
        >
          <thead>
            <tr>
              <th>
                <Typography variant="caption" color="text.secondary">
                  {t('challenges.questions')}
                </Typography>
              </th>
              {Array.from({ length: challenge.questionsCount }, (_, index) => (
                <th key={index} scope="col">
                  <Typography variant="metric" color="text.secondary" sx={{ fontSize: 14 }}>
                    {String(index + 1).padStart(2, '0')}
                  </Typography>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {players.map((player, playerIndex) => (
              <tr key={playerIndex}>
                <th scope="row">
                  <Typography variant="caption" sx={{ overflowWrap: 'anywhere' }}>
                    {player.username}
                  </Typography>
                </th>
                {Array.from({ length: challenge.questionsCount }, (_, index) => {
                  const value = player.results?.[index] ?? -1;
                  const label = `${player.username}: ${getResultTitle(value)}`;
                  return (
                    <td key={index}>
                      <ChallengeChip
                        sx={
                          compact
                            ? { width: 22, height: 22, '& .MuiChip-label': { px: 0 } }
                            : undefined
                        }
                        tone={mapResultTone(value)}
                        label={
                          value === 1 ? '\u2713' : value === 0 ? '\u00d7' : finished ? '-' : '...'
                        }
                        title={label}
                        aria-label={label}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </Box>
  );
};
export default ChallengeResultsCard;
