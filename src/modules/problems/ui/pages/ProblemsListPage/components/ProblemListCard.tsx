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
import { getDifficultyColor, getDifficultyLabelKey } from 'modules/problems/config/difficulty';
import { ProblemListItem } from 'modules/problems/domain/entities/problem.entity.ts';
import IconifyIcon from 'shared/components/base/IconifyIcon.tsx';

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

  const statusColor = getStatusColor();

  return (
    <Card
      component={RouterLink}
      to={getResourceById(resources.Problem, problem.id)}
      sx={{
        display: 'block',
        textDecoration: 'none',
        color: 'inherit',
        p: { xs: 1.25, sm: 2 },
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
      <Box
        sx={{
          display: { xs: 'grid', sm: 'flex' },
          position: 'relative',
          gridTemplateColumns: { xs: 'minmax(0, 1fr) auto' },
          gridTemplateRows: { xs: 'auto auto' },
          columnGap: { xs: 1, sm: 1.5 },
          rowGap: { xs: 0.5, sm: 1.5 },
          alignItems: { xs: 'center', sm: 'center' },
          justifyContent: 'space-between',
        }}
      >
        <Stack
          direction="row"
          spacing={1.25}
          alignItems={{ xs: 'center', sm: 'flex-start' }}
          minWidth={0}
          sx={{ gridColumn: { xs: 1, sm: 'auto' }, gridRow: { xs: 1, sm: 'auto' }, flex: 1 }}
        >
          <Box
            sx={{
              position: { xs: 'absolute', sm: 'static' },
              left: { xs: 0, sm: 'auto' },
              top: { xs: '50%', sm: 'auto' },
              transform: { xs: 'translateY(-50%)', sm: 'none' },
              flexShrink: 0,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {renderStatusIcon()}
          </Box>

          <Stack
            direction="column"
            spacing={0.5}
            minWidth={0}
            flex={1}
            sx={{ pl: { xs: 4, sm: 0 } }}
          >
            <Typography
              variant="subtitle1"
              fontWeight={600}
              color="text.primary"
              sx={{ lineHeight: 1.25, overflowWrap: 'anywhere' }}
            >
              {problem.id}. {problem.title}
            </Typography>
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>{renderSolvedBadges()}</Box>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: { xs: 'block', sm: 'none' },
            gridColumn: { xs: 2, sm: 'auto' },
            gridRow: { xs: 1, sm: 'auto' },
            justifySelf: 'end',
            alignSelf: 'start',
          }}
        >
          {renderDifficultyBadge()}
        </Box>

        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent="flex-end"
          flexShrink={0}
          sx={{ display: { xs: 'none', sm: 'flex' } }}
        >
          {renderDifficultyBadge()}
          {renderProblemRatingBadge()}
        </Stack>

        <Box
          sx={{
            display: { xs: 'block', sm: 'none' },
            gridColumn: 1,
            gridRow: 2,
            pl: 4,
            minWidth: 0,
            mt: -0.25,
          }}
        >
          {renderSolvedBadges()}
        </Box>

        <Box
          sx={{
            display: { xs: 'block', sm: 'none' },
            gridColumn: { xs: 2, sm: 'auto' },
            gridRow: { xs: 2, sm: 'auto' },
            justifySelf: 'end',
            alignSelf: 'end',
          }}
        >
          {renderProblemRatingBadge()}
        </Box>
      </Box>
    </Card>
  );
};

export default ProblemListCard;
