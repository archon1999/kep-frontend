import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Card,
  Chip,
  Divider,
  Stack,
  Tooltip,
  Typography,
  alpha,
  useTheme,
} from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';
import { getDifficultyColor, getDifficultyLabelKey } from 'modules/problems/config/difficulty';
import { ProblemListItem } from 'modules/problems/domain/entities/problem.entity.ts';


interface ProblemListCardProps {
  problem: ProblemListItem;
}

const ProblemListCard = ({ problem }: ProblemListCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const getStatusColor = () => {
    if (problem.userInfo?.hasSolved) {
      return theme.palette.success.main;
    }

    if (problem.userInfo?.hasAttempted) {
      return theme.palette.error.main;
    }

    return theme.palette.primary.main;
  };

  const getRowBackground = () => {
    if (problem.userInfo?.hasSolved) {
      return alpha(theme.palette.success.main, 0.12);
    }

    if (problem.userInfo?.hasAttempted) {
      return alpha(theme.palette.error.main, 0.06);
    }

    return undefined;
  };

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

    return (
      <Box width={20}></Box>
    );
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
      <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
        <Stack direction="row" spacing={0.75} alignItems="center">
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
          sx={{ borderColor: alpha(theme.palette.text.primary, 0.08), minHeight: 24 }}
        />

        <Stack direction="row" spacing={0.75} alignItems="center">
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

  const statusColor = getStatusColor();

  return (
    <Card
      component={RouterLink}
      to={getResourceById(resources.Problem, problem.id)}
      sx={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        p: 2,
        borderRadius: 2,
        border: 0,
        borderLeft: '6px solid',
        borderLeftColor: statusColor,
        bgcolor: getRowBackground() ?? 'background.paper',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
          borderLeftColor: statusColor,
        },
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1.5}>
        <Stack direction="row" spacing={1.5} alignItems="flex-start" justifyContent="space-between">
          <Stack direction="row" spacing={1.25} alignItems="center" flex={1}>
            {renderStatusIcon()}

            <Stack direction="column" spacing={0.25} minWidth={0}>
              <Typography variant="subtitle1" fontWeight={600} color="text.primary">
                {problem.id}. {problem.title}
              </Typography>
              {renderSolvedBadges()}
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          {renderDifficultyBadge()}
          {problem.problemRating != null ? (
            <Chip
              size="small"
              icon={<IconifyIcon icon="mdi:chart-line" width={16} height={16} />}
              label={problem.problemRating}
              variant="soft"
            />
          ) : null}
        </Stack>
      </Stack>
    </Card>
  );
};

export default ProblemListCard;
