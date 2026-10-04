import { useTranslation } from 'react-i18next';
import {
  Avatar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import type { HackathonProject, HackathonStanding } from 'modules/hackathons/domain';
import { formatHackathonDuration } from 'modules/hackathons/ui/shared';

interface HackathonStandingsTableProps {
  standings: HackathonStanding[];
  projects: HackathonProject[];
}

const HackathonStandingsTable = ({ standings, projects }: HackathonStandingsTableProps) => {
  const { t } = useTranslation();
  const singleProject = projects.length === 1;

  return (
    <TableContainer
      role="region"
      aria-label={t('hackathons.standings')}
      tabIndex={0}
      sx={{ borderRadius: 0, overflowX: 'auto' }}
    >
      <Table
        aria-label={t('hackathons.standings')}
        size="small"
        sx={{
          minWidth: { xs: 296 + projects.length * 80, sm: 480 + projects.length * 96 },
          tableLayout: 'fixed',
          '& tbody td, & tbody th': { py: 1.75 },
          '& tbody tr:last-child td, & tbody tr:last-child th': { borderBottom: 0 },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: { xs: 40, sm: 64 }, px: { xs: 1, sm: 2 } }}>
              #
            </TableCell>
            <TableCell
              sx={{ width: { xs: 176, sm: singleProject ? 'calc(40% - 25.6px)' : 'auto' } }}
            >
              {t('hackathons.contestant')}
            </TableCell>
            <TableCell
              align="right"
              sx={{
                width: { xs: 80, sm: singleProject ? 'calc(25% - 16px)' : 104 },
                textAlign: { xs: 'right', sm: singleProject ? 'center' : 'right' },
              }}
            >
              {t('hackathons.points')}
            </TableCell>
            {projects.map((project) => (
              <TableCell
                key={project.symbol}
                align="right"
                sx={{
                  width: { xs: 80, sm: singleProject ? 'calc(35% - 22.4px)' : 96 },
                  textAlign: { xs: 'right', sm: singleProject ? 'center' : 'right' },
                }}
              >
                <Tooltip title={project.project.title}>
                  <Typography component="span" variant="subtitle2" tabIndex={0}>
                    {project.symbol}
                  </Typography>
                </Tooltip>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {standings.map((participant) => (
            <TableRow key={participant.username} hover>
              <TableCell
                align="center"
                sx={{
                  fontVariantNumeric: 'tabular-nums',
                  fontWeight: 600,
                  color: 'text.primary',
                  px: { xs: 1, sm: 2 },
                }}
              >
                {participant.rank}
              </TableCell>
              <TableCell component="th" scope="row">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    src={participant.userAvatar}
                    alt=""
                    sx={{
                      width: { xs: 28, sm: 36 },
                      height: { xs: 28, sm: 36 },
                      fontSize: 14,
                      flexShrink: 0,
                    }}
                  >
                    {participant.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Stack direction="column" spacing={0.25} minWidth={0}>
                    <Typography
                      variant="subtitle2"
                      color="text.primary"
                      fontWeight={600}
                      noWrap
                      sx={{ maxWidth: '100%' }}
                    >
                      {participant.username}
                    </Typography>
                    {participant.userFullName ? (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        noWrap
                        sx={{ maxWidth: '100%', display: { xs: 'none', sm: 'block' } }}
                      >
                        {participant.userFullName}
                      </Typography>
                    ) : null}
                  </Stack>
                </Stack>
              </TableCell>
              <TableCell
                align="right"
                sx={{
                  fontVariantNumeric: 'tabular-nums',
                  textAlign: { xs: 'right', sm: singleProject ? 'center' : 'right' },
                }}
              >
                <Typography variant="subtitle2" color="text.primary" fontWeight={700}>
                  {participant.points ?? 0}
                </Typography>
              </TableCell>
              {projects.map((project) => {
                const result = participant.projectResults?.find(
                  (item) => item.symbol === project.symbol,
                );

                return (
                  <TableCell
                    key={project.symbol}
                    align="right"
                    sx={{ fontVariantNumeric: 'tabular-nums' }}
                  >
                    {result ? (
                      <Stack
                        direction="column"
                        spacing={0.25}
                        alignItems={{ xs: 'flex-end', sm: singleProject ? 'center' : 'flex-end' }}
                      >
                        <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                          {result.points}
                        </Typography>
                        {result.hackathonTime ? (
                          <Typography variant="caption" color="text.secondary">
                            {formatHackathonDuration(result.hackathonTime)}
                          </Typography>
                        ) : null}
                      </Stack>
                    ) : (
                      <Typography variant="body2" color="text.disabled">
                        —
                      </Typography>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HackathonStandingsTable;
