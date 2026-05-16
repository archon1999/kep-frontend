import {
  Box,
  Button,
  Container,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  ListSubheader,
  Paper,
  Skeleton,
  Stack,
  Typography,
  listItemButtonClasses,
  listItemTextClasses,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { HashLinkBehavior } from 'app/theme/components/Link';
import { useSystemUpdates } from 'modules/home/application/queries';
import type { HomeSystemUpdate } from 'modules/home/domain/entities/home.entity';
import SystemUpdateImage from 'modules/home/ui/shared/components/SystemUpdateImage';
import SystemUpdateLikeButton from 'modules/home/ui/shared/components/SystemUpdateLikeButton';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import Logo from 'shared/components/common/Logo';
import ScrollSpy from 'shared/components/scroll-spy';
import ScrollSpyContent from 'shared/components/scroll-spy/ScrollSpyContent';
import ScrollSpyNavItem from 'shared/components/scroll-spy/ScrollSpyNavItem';
import useHashScrollIntoView from 'shared/hooks/useHashScrollIntoView';

type UpdateGroup = {
  date: string;
  dateLabel: string;
  items: HomeSystemUpdate[];
};

const getUpdateAnchorId = (date: string) => `system-updates-${date}`;

const groupUpdatesByDate = (updates: HomeSystemUpdate[]): UpdateGroup[] => {
  const groups = new Map<string, HomeSystemUpdate[]>();

  updates.forEach((update) => {
    const date = dayjs(update.date).format('YYYY-MM-DD');
    groups.set(date, [...(groups.get(date) ?? []), update]);
  });

  return Array.from(groups.entries()).map(([date, items]) => ({
    date,
    dateLabel: dayjs(date).format('DD MMMM, YYYY'),
    items,
  }));
};

const groupItemsByType = (items: HomeSystemUpdate[]) => {
  return {
    New: items.filter((item) => item.updateType === 'new'),
    Update: items.filter((item) => item.updateType !== 'new'),
  };
};

const UpdatesPageHeader = () => {
  const { t } = useTranslation();

  return (
    <Paper
      sx={{
        p: { xs: 3, md: 5 },
        position: 'relative',
        overflow: 'hidden',
        zIndex: 1,
        borderBottom: 1,
        borderColor: 'divider',
        outline: 0,
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          display: { xs: 'none', sm: 'block' },
          inset: 0,
          pointerEvents: 'none',
          zIndex: -1,
          overflow: 'hidden',
        }}
      >
        <Box
          sx={(theme) => ({
            position: 'absolute',
            right: { sm: 40, md: 72 },
            top: '50%',
            width: 260,
            height: 260,
            borderRadius: '50%',
            transform: 'translateY(-50%)',
            background: `radial-gradient(circle, ${theme.vars.palette.primary.main} 0%, transparent 68%)`,
            opacity: 0.12,
          })}
        />
        <Logo
          showName={false}
          sx={{
            position: 'absolute',
            right: { sm: 56, md: 96 },
            top: '50%',
            width: 150,
            height: 150,
            opacity: 0.18,
            transform: 'translateY(-50%) rotate(18deg)',
          }}
        />
      </Box>

      <Grid container>
        <Grid size={{ xs: 12, md: 8, lg: 9 }}>
          <Typography variant="h3">{t('homePage.updates.pageTitle')}</Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};

interface UpdateLogItemProps {
  update: HomeSystemUpdate;
  onChanged: () => void;
}

const UpdateLogItem = ({ update, onChanged }: UpdateLogItemProps) => {
  return (
    <ListItem disableGutters disablePadding sx={{ alignItems: 'flex-start' }}>
      <ListItemIcon
        sx={{
          minWidth: 22,
          height: 22,
          alignItems: 'center',
          justifyContent: 'center',
          mt: 1,
        }}
      >
        <IconifyIcon icon="material-symbols:circle" fontSize={8} color="text.primary" />
      </ListItemIcon>
      <ListItemText
        disableTypography
        primary={
          <Box sx={{ minWidth: 0 }}>
            <Typography component="div" variant="body2" sx={{ wordBreak: 'break-word' }}>
              <Box component="span" sx={{ fontWeight: 700, color: 'text.primary' }}>
                {update.title}
              </Box>
              {': '}
              <Box
                component="span"
                color="text.secondary"
                dangerouslySetInnerHTML={{ __html: update.description }}
                sx={{
                  '& p': { display: 'inline', m: 0 },
                  '& p + p': { display: 'block', mt: 1 },
                }}
              />
            </Typography>

            {update.image && (
              <Box sx={{ mt: 2, height: 200, maxWidth: 1 }}>
                <SystemUpdateImage
                  src={update.image}
                  sx={{
                    height: 200,
                    maxWidth: 1,
                    width: 'auto',
                    objectFit: 'contain',
                    borderRadius: 4,
                  }}
                />
              </Box>
            )}

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <SystemUpdateLikeButton update={update} onChanged={onChanged} />
            </Box>
          </Box>
        }
        sx={{ wordBreak: 'break-word' }}
      />
    </ListItem>
  );
};

interface UpdateLogCardProps {
  group: UpdateGroup;
  onChanged: () => void;
}

const UpdateLogCard = ({ group, onChanged }: UpdateLogCardProps) => {
  const groupedItems = groupItemsByType(group.items);

  return (
    <Paper variant="outlined" background={1} sx={{ borderRadius: 6, p: { xs: 3, md: 5 } }}>
      {Object.entries(groupedItems).map(([category, items]) => {
        if (!items.length) return null;

        return (
          <Box key={category} sx={{ '&:not(:last-of-type)': { mb: 4 } }}>
            <Typography fontWeight={700} sx={{ mb: 2 }}>
              {category}
            </Typography>
            <List dense disablePadding>
              {items.map((update) => (
                <UpdateLogItem key={update.id} update={update} onChanged={onChanged} />
              ))}
            </List>
          </Box>
        );
      })}
    </Paper>
  );
};

interface UpdateSectionProps {
  group: UpdateGroup;
  onChanged: () => void;
}

const UpdateSection = ({ group, onChanged }: UpdateSectionProps) => {
  const anchorId = getUpdateAnchorId(group.date);

  return (
    <Paper sx={{ p: { xs: 3, md: 5 } }}>
      <Container maxWidth="md" disableGutters>
        <Box sx={{ mb: 2 }}>
          <ScrollSpyContent id={anchorId}>
            <Typography
              variant="h5"
              color="primary.main"
              sx={{
                fontWeight: 700,
                fontSize: { xs: 'h6.fontSize', md: 'h5.fontSize' },
              }}
            >
              {group.dateLabel}
            </Typography>
          </ScrollSpyContent>
        </Box>

        <UpdateLogCard group={group} onChanged={onChanged} />
      </Container>
    </Paper>
  );
};

interface UpdatesSideNavProps {
  groups: UpdateGroup[];
}

const UpdatesSideNav = ({ groups }: UpdatesSideNavProps) => {
  const { t } = useTranslation();

  return (
    <Paper background={1} sx={{ height: 1, width: 1, p: { xs: 3, md: 5 } }}>
      <List
        dense
        sx={{
          width: '100%',
          position: 'sticky',
          top: 96,
          [`& .${listItemButtonClasses.root}`]: {
            ml: 2,
            mb: 1,
            [`& .${listItemTextClasses.root}`]: {
              ml: 2,
              mt: 0,
            },
            '&::before': {
              content: '"\\2022"',
              verticalAlign: 'top',
              ml: -2,
            },
          },
        }}
        component="nav"
        aria-labelledby="updates-list-subheader"
        disablePadding
        subheader={
          <ListSubheader
            component="div"
            id="updates-list-subheader"
            sx={{
              background: 'transparent',
              typography: 'subtitle2',
              fontWeight: 700,
              color: 'text.primary',
              px: 0,
              mb: 2,
            }}
          >
            {t('homePage.updates.navigatorTitle')}
          </ListSubheader>
        }
      >
        {groups.map((group) => {
          const href = `#${getUpdateAnchorId(group.date)}`;

          return (
            <ScrollSpyNavItem key={group.date}>
              {({ activeElemId }) => (
                <ListItemButton
                  LinkComponent={HashLinkBehavior}
                  href={href}
                  sx={{
                    p: 0,
                    mb: 0.5,
                    ml: 1,
                    display: 'list-item',
                    '&::marker': {
                      paddingRight: 0.5,
                    },
                    [`&.${listItemButtonClasses.selected}`]: {
                      bgcolor: 'transparent',
                      '&:hover': {
                        bgcolor: 'transparent',
                      },
                    },
                  }}
                  disableRipple
                  selected={href === `#${activeElemId}`}
                >
                  <ListItemText
                    primary={group.dateLabel}
                    slotProps={{ primary: { variant: 'body2', fontWeight: 500 } }}
                    sx={{ display: 'inline-block', ml: -1 }}
                  />
                </ListItemButton>
              )}
            </ScrollSpyNavItem>
          );
        })}
      </List>
    </Paper>
  );
};

const UpdatesPage = () => {
  const { t } = useTranslation();
  const { data, isLoading, isLoadingMore, hasMore, loadMore, mutate } = useSystemUpdates();
  const updates = data?.data ?? [];
  const groups = useMemo(() => groupUpdatesByDate(updates), [updates]);

  useHashScrollIntoView({ block: 'start', behavior: 'smooth' });

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <ScrollSpy offset={400}>
        <UpdatesPageHeader />

        <Grid container sx={{ alignItems: 'stretch', flex: 1, minHeight: 0 }}>
          <Grid
            sx={{
              order: { md: 1 },
              display: { xs: 'none', md: 'flex' },
            }}
            size={{
              xs: 12,
              md: 4,
              lg: 3,
            }}
          >
            {isLoading ? (
              <Paper background={1} sx={{ height: 1, width: 1, p: { xs: 3, md: 5 } }}>
                <Skeleton variant="text" width={120} sx={{ mb: 2 }} />
                <Stack spacing={1.5}>
                  {Array.from({ length: 8 }).map((_, index) => (
                    <Skeleton key={index} variant="text" />
                  ))}
                </Stack>
              </Paper>
            ) : (
              <UpdatesSideNav groups={groups} />
            )}
          </Grid>

          <Grid
            sx={{ display: 'flex', flexDirection: 'column' }}
            size={{
              xs: 12,
              md: 8,
              lg: 9,
            }}
          >
            {isLoading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Paper key={index} sx={{ p: { xs: 3, md: 5 } }}>
                  <Container maxWidth="md" disableGutters>
                    <Skeleton variant="text" width="55%" height={38} sx={{ mb: 2 }} />
                    <Skeleton variant="rounded" height={180} sx={{ borderRadius: 6 }} />
                  </Container>
                </Paper>
              ))
            ) : groups.length ? (
              <>
                {groups.map((group) => (
                  <UpdateSection key={group.date} group={group} onChanged={() => mutate()} />
                ))}

                {hasMore && (
                  <Paper sx={{ p: { xs: 3, md: 5 } }}>
                    <Container maxWidth="md" disableGutters>
                      <Button variant="outlined" onClick={loadMore} disabled={isLoadingMore}>
                        {t('homePage.updates.loadMore')}
                      </Button>
                    </Container>
                  </Paper>
                )}
              </>
            ) : (
              <Paper sx={{ p: { xs: 3, md: 5 } }}>
                <Typography variant="body2" color="text.secondary">
                  {t('homePage.updates.empty')}
                </Typography>
              </Paper>
            )}
          </Grid>
        </Grid>
      </ScrollSpy>
    </Box>
  );
};

export default UpdatesPage;
