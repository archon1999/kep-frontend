import { ReactNode } from 'react';
import { Box, Skeleton, Stack, Typography } from '@mui/material';
import { ContestDetail } from 'modules/contests/domain/entities/contest-detail.entity';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import Image from 'shared/components/base/Image.tsx';
import ContestTabs from './ContestTabs';

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
        borderRadius: { xs: 2, md: 3 },
        p: { xs: 1.5, md: 4 },
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${theme.palette.primary.light}18, ${theme.palette.info.light}12)`,
      })}
    >
      {showLogoOverlay ? (
        <Box
          sx={{
            position: 'absolute',
            right: { xs: -44, md: 24 },
            bottom: { xs: -36, md: 8 },
            opacity: { xs: 0.06, md: 0.08 },
            pointerEvents: 'none',
          }}
        >
          <Image sx={{ width: { xs: 150, md: 200 } }} src={contest?.logo ?? ''}></Image>
        </Box>
      ) : null}

      <Stack spacing={{ xs: 1.25, md: 2 }} position="relative" zIndex={1}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={1} alignItems="center">
          {isLoading ? (
            <Skeleton variant="text" width="60%" height={28} sx={{ flex: 1, minWidth: 0 }} />
          ) : (
            <Typography
              variant="h5"
              fontWeight={800}
              sx={{
                flex: 1,
                minWidth: 0,
                fontSize: { xs: '1.25rem', md: undefined },
                lineHeight: { xs: 1.15, md: undefined },
                textAlign: { xs: 'center', md: 'left' },
              }}
            >
              {title}
            </Typography>
          )}
          {rightContent ? (
            isLoading ? (
              <Skeleton variant="rounded" width={140} height={40} />
            ) : (
              rightContent
            )
          ) : null}
        </Stack>

        {!hideTabs ? (
          isLoading ? (
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={{ xs: 1, md: 1.5 }}
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
              spacing={{ xs: 1, md: 1.5 }}
              alignItems={{ xs: 'flex-start', md: 'center' }}
              sx={{ width: '100%', minWidth: 0 }}
            >
              <ContestTabs contestId={resolvedContestId} status={status} isRated={rated} />
              {tabsRightContent ? (
                <Box
                  className="contest-page-tabs-actions"
                  sx={{
                    ml: { md: 'auto' },
                    '& .MuiButton-root': {
                      minHeight: { xs: 32, md: undefined },
                      px: { xs: 1.25, md: undefined },
                      py: { xs: 0.5, md: undefined },
                      fontSize: { xs: '0.8rem', md: undefined },
                    },
                    '& .MuiButton-startIcon': {
                      mr: { xs: 0.5, md: undefined },
                      '& svg': {
                        fontSize: { xs: 16, md: undefined },
                      },
                    },
                  }}
                >
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
