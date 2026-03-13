import { ReactNode } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import ContestTabs from './ContestTabs';
import { ContestDetail } from '../../domain/entities/contest-detail.entity';
import { ContestStatus } from '../../domain/entities/contest-status';
import Image from 'shared/components/base/Image.tsx';

interface ContestPageHeaderProps {
  title: string;
  contest?: ContestDetail | null;
  contestId?: number | string;
  rightContent?: ReactNode;
  tabsRightContent?: ReactNode;
  hideTabs?: boolean;
  isRated?: boolean;
  isLoading?: boolean;
  showLogoOverlay?: boolean;
}

const ContestPageHeader = ({
  title,
  contest,
  contestId,
  rightContent,
  tabsRightContent,
  hideTabs = false,
  isRated,
  isLoading = false,
  showLogoOverlay = true,
}: ContestPageHeaderProps) => {
  const resolvedContestId = contest?.id ?? contestId ?? 0;
  const status = contest?.statusCode ?? ContestStatus.Already;
  const rated = contest?.isRated ?? isRated;

  return (
    <Box
      sx={(theme) => ({
        borderRadius: 3,
        p: { xs: 3, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}18, ${theme.palette.info.light}12)`,
      })}
    >
      {showLogoOverlay ? (
        <Box
          sx={{
            position: 'absolute',
            right: { xs: -24, md: 24 },
            bottom: { xs: -24, md: 8 },
            opacity: 0.08,
            pointerEvents: 'none',
          }}
        >
          <Image sx={{ width: 200 }} src={contest?.logo ?? ''}></Image>
        </Box>
      ) : null}

      <Stack spacing={2} position="relative" zIndex={1}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1.5} alignItems="center">
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={36} sx={{ flex: 1, minWidth: 0 }} />
          ) : (
            <Typography variant="h5" fontWeight={800} sx={{ flex: 1, minWidth: 0 }}>
              {title}
            </Typography>
          )}
          {rightContent ? (
            isLoading ? <Skeleton variant="rounded" width={140} height={40} /> : rightContent
          ) : null}
        </Stack>

        {!hideTabs ? (
          isLoading ? (
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', md: 'center' }}
            >
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                {Array.from({ length: 5 }).map((_, index) => (
                  <Skeleton key={index} variant="rounded" width={108} height={36} />
                ))}
              </Stack>
              {tabsRightContent ? (
                <Skeleton variant="rounded" width={160} height={40} sx={{ ml: { md: 'auto' } }} />
              ) : null}
            </Stack>
          ) : (
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={1.5}
              alignItems={{ xs: 'flex-start', md: 'center' }}
            >
              <ContestTabs contestId={resolvedContestId} status={status} isRated={rated} />
              {tabsRightContent ? (
                <Box sx={{ ml: { md: 'auto' } }}>
                  {tabsRightContent}
                </Box>
              ) : null}
            </Stack>
          )
        ) : null}
      </Stack>
    </Box>
  );
};

export default ContestPageHeader;
