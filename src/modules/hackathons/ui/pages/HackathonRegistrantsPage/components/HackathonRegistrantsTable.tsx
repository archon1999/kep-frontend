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
  Typography,
} from '@mui/material';
import type { HackathonRegistrant } from 'modules/hackathons/domain';

interface HackathonRegistrantsTableProps {
  registrants: (HackathonRegistrant & { position: number })[];
}

const HackathonRegistrantsTable = ({ registrants }: HackathonRegistrantsTableProps) => {
  const { t } = useTranslation();

  return (
    <TableContainer
      role="region"
      aria-label={t('hackathons.registrants')}
      tabIndex={0}
      sx={{ borderRadius: 0, overflowX: 'auto' }}
    >
      <Table
        aria-label={t('hackathons.registrants')}
        size="small"
        sx={{
          minWidth: 360,
          '& tbody td, & tbody th': { py: 1.75 },
          '& tbody tr:last-child td, & tbody tr:last-child th': { borderBottom: 0 },
        }}
      >
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ width: 72 }}>
              #
            </TableCell>
            <TableCell>{t('hackathons.contestant')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {registrants.map((registrant) => (
            <TableRow key={registrant.username} hover>
              <TableCell align="center" sx={{ fontVariantNumeric: 'tabular-nums' }}>
                {registrant.position}
              </TableCell>
              <TableCell component="th" scope="row">
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar
                    src={registrant.userAvatar}
                    alt=""
                    sx={{ width: 36, height: 36, fontSize: 14 }}
                  >
                    {registrant.username.charAt(0).toUpperCase()}
                  </Avatar>
                  <Stack direction="column" spacing={0.25}>
                    <Typography variant="subtitle2" color="text.primary" fontWeight={600}>
                      {registrant.username}
                    </Typography>
                    {registrant.userFullName ? (
                      <Typography variant="caption" color="text.secondary">
                        {registrant.userFullName}
                      </Typography>
                    ) : null}
                  </Stack>
                </Stack>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default HackathonRegistrantsTable;
