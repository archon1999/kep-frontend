import { useGiveawayPage } from 'modules/giveaways/application/hooks/useGiveawayPage';
import { GiveawayExperience } from 'modules/giveaways/ui/pages/GiveawayPage/components/GiveawayExperience';
import FramedPage from 'shared/components/sections/common/FramedPage';
import { GiveawayRoot } from './GiveawayPage.styles';

export default function GiveawayPage() {
  const { id, currentUser } = useGiveawayPage();

  if (!currentUser) return null;
  return (
    <GiveawayRoot>
      <FramedPage>
        <GiveawayExperience
          key={`${id}:${currentUser.username}`}
          id={id}
          username={currentUser.username}
        />
      </FramedPage>
    </GiveawayRoot>
  );
}
