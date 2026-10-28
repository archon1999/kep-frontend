import { Stack } from '@mui/material';
import { resources } from 'app/routes/resources';
import { type Hackathon } from 'modules/hackathons/domain';
import PageHeader from 'shared/components/sections/common/PageHeader';
import HackathonStatusChip from './HackathonStatusChip';
import HackathonTabs from './HackathonTabs';

const HackathonPageHeader = ({ hackathon }: { hackathon: Hackathon }) => (
  <PageHeader
    variant="detail"
    title={hackathon.title}
    titleId="hackathon-title"
    backTo={resources.Hackathons}
    actionComponent={
      <Stack direction="row">
        <HackathonStatusChip hackathon={hackathon} />
      </Stack>
    }
    navigationComponent={<HackathonTabs hackathon={hackathon} />}
  />
);
export default HackathonPageHeader;
