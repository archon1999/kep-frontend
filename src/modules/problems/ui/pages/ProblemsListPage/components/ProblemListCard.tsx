import { useTranslation } from 'react-i18next';
import { Box, Chip, Divider, Stack, Tooltip, Typography, alpha, useTheme } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources.ts';
import { getDifficultyColor, getDifficultyLabelKey } from 'modules/problems/config/difficulty';
import { ProblemListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import ProblemListRow from './ProblemListRow';

interface ProblemListCardProps {
  problem: ProblemListItem;
}

const ProblemListCard = ({ problem }: ProblemListCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const renderStatusIcon = () => {
    if (problem.userInfo?.hasSolved) {
      return (
        <Tooltip title={t('problems.statusSolved')}>
          <IconifyIcon
            icon="mdi:check-circle"
            width={20}
            height={20}
            color={theme.palette.success.main}
          />
        </Tooltip>
      );
    }

    if (problem.userInfo?.hasAttempted) {
      return (
        <Tooltip title={t('problems.statusUnsolved')}>
          <IconifyIcon
            icon="mdi:close-circle"
            width={20}
            height={20}
            color={theme.palette.error.main}
          />
        </Tooltip>
      );
    }

    return <Box width={20}></Box>;
  };

  const renderDifficultyBadge = () => {
    const color = getDifficultyColor(problem.difficulty);
    const labelKey = getDifficultyLabelKey(problem.difficulty);

    return (
      <Chip
        size="small"
        label={problem.difficultyTitle || (labelKey ? t(labelKey) : '')}
        color={color}
        variant="outlined"
      />
    );
  };

  const renderSolvedBadges = () => {
    const solved = problem.solved ?? 0;
    const notSolved = problem.notSolved ?? Math.max((problem.attemptsCount ?? 0) - solved, 0);

    return (
      <Stack direction="row" spacing={{ xs: 0.75, sm: 1 }} alignItems="center" flexWrap="nowrap">
        <Stack direction="row" spacing={{ xs: 0.5, sm: 0.75 }} alignItems="center">
          <IconifyIcon
            icon="mdi:user-check"
            width={18}
            height={18}
            color={theme.palette.success.main}
          />
          <Typography variant="body2" fontWeight={700}>
            {solved}
          </Typography>
        </Stack>

        <Divider
          orientation="vertical"
          flexItem
          sx={{
            borderColor: alpha(theme.palette.text.primary, 0.08),
            minHeight: { xs: 18, sm: 24 },
          }}
        />

        <Stack direction="row" spacing={{ xs: 0.5, sm: 0.75 }} alignItems="center">
          <IconifyIcon
            icon="mdi:user-minus"
            width={18}
            height={18}
            color={theme.palette.error.main}
          />
          <Typography
            variant="body2"
            fontWeight={700}
            color={notSolved > 0 ? 'error.main' : 'text.secondary'}
          >
            {notSolved}
          </Typography>
        </Stack>
      </Stack>
    );
  };

  const renderProblemRatingBadge = () => (
    <>
      {problem.problemRating != null ? (
        <Chip
          size="small"
          icon={<IconifyIcon icon="mdi:chart-line" width={16} height={16} />}
          label={problem.problemRating}
          variant="soft"
        />
      ) : null}
    </>
  );

  return (
    <ProblemListRow
      href={getResourceById(resources.Problem, problem.id)}
      title={problem.id + '. ' + problem.title}
      status={renderStatusIcon()}
      counts={renderSolvedBadges()}
      difficulty={renderDifficultyBadge()}
      rating={renderProblemRatingBadge()}
    />
  );
};

export default ProblemListCard;
