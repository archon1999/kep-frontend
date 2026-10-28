import { ReactNode } from 'react';
import { Skeleton } from '@mui/material';
import { resources } from 'app/routes/resources';
import { ContestDetail } from 'modules/contests/domain/entities/contest-detail.entity';
import { ContestStatus } from 'modules/contests/domain/entities/contest-status';
import PageHeader from 'shared/components/sections/common/PageHeader';
import ContestTabs from './ContestTabs';

interface ContestPageHeaderProps {
  title: string;
  contest?: ContestDetail | null;
  contestId?: number | string;
  hideTabs?: boolean;
  isRated?: boolean;
  isLoading?: boolean;
  actions?: ReactNode;
}

const ContestPageHeader = ({
  title,
  contest,
  contestId,
  hideTabs = false,
  isRated,
  isLoading = false,
  actions,
}: ContestPageHeaderProps) => (
  <PageHeader
    variant="detail"
    title={title}
    titleId="contest-detail-title"
    backTo={resources.Contests}
    actionComponent={actions ? <>{actions}</> : undefined}
    navigationComponent={
      !hideTabs &&
      (isLoading ? (
        <Skeleton height={56} />
      ) : (
        <ContestTabs
          contestId={contest?.id ?? contestId ?? 0}
          status={contest?.statusCode ?? ContestStatus.Already}
          isRated={contest?.isRated ?? isRated}
        />
      ))
    }
  />
);

export default ContestPageHeader;
