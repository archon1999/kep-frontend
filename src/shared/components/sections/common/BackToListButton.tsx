import { MouseEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Button } from '@mui/material';
import { resources } from 'app/routes/resources';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const destinationKeys: Record<string, string> = {
  [resources.Problems]: 'menu.problems',
  [resources.ProblemsRating]: 'problems.rating.title',
  [resources.StudyPlans]: 'problems.studyPlans.pageTitle',
  [resources.Projects]: 'menu.projects',
  [resources.Tests]: 'menu.tests',
  [resources.Contests]: 'menu.contests',
  [resources.Hackathons]: 'menu.hackathons',
  [resources.Tournaments]: 'menu.tournaments',
  [resources.Arena]: 'menu.arena',
  [resources.Challenges]: 'menu.challenges',
  [resources.Duels]: 'menu.duels',
  [resources.Kepcoin]: 'menu.kepcoin',
  [resources.Games]: 'menu.games',
  [resources.Blog]: 'menu.blog',
  [resources.Users]: 'menu.users',
};

interface BackToListButtonProps {
  to: string;
  label?: string;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
}

const BackToListButton = ({ to, label, onClick }: BackToListButtonProps) => {
  const { t } = useTranslation();
  const destinationKey = destinationKeys[to.split(/[?#]/)[0]];
  const text =
    label ??
    (destinationKey
      ? t('common.backTo', { destination: t(destinationKey) })
      : t('common.backToList'));

  return (
    <Button
      component={Link}
      to={to}
      onClick={onClick}
      variant="outlined"
      color="primary"
      startIcon={<IconifyIcon icon="solar:alt-arrow-left-linear" />}
      sx={{ maxWidth: '100%', width: 'fit-content', flexShrink: 0 }}
    >
      {text}
    </Button>
  );
};

export default BackToListButton;
