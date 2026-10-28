import { useTranslation } from 'react-i18next';
import PageHeader from 'shared/components/sections/common/PageHeader';

const ArenaListPageHeroCard = () => {
  const { t } = useTranslation();
  return (
    <PageHeader
      variant="hero"
      title={t('arena.title')}
      titleId="arena-list-title"
      badge={t('arena.heroBadge')}
      subtitle={t('arena.listHeroSubtitle')}
    />
  );
};
export default ArenaListPageHeroCard;
