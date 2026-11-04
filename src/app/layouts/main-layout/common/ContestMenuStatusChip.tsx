import ContestStatusChip from 'modules/contests/ui/shared/components/ContestStatusChip';
import { useFeaturedContestPromo } from 'modules/home/application/hooks/useFeaturedContestPromo';

const ContestMenuStatusChip = ({ id }: { id?: string }) => {
  const { status } = useFeaturedContestPromo();
  if (status === undefined && !id) return null;

  return (
    <span id={id} hidden={status === undefined}>
      <ContestStatusChip status={status} />
    </span>
  );
};

export default ContestMenuStatusChip;
