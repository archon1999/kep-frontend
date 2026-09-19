import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router';
import { Button, Stack } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider';
import { getResourceById, resources } from 'app/routes/resources';
import { useLinkedGiveaways } from '../../../application/queries';

export default function LinkedGiveaways({
  source,
  id,
}: {
  source: 'contest' | 'arena';
  id?: number | string;
}) {
  const { currentUser } = useAuth();
  const { t } = useTranslation();
  const { data } = useLinkedGiveaways(source, id, currentUser?.username);
  if (!data?.length) return null;
  return (
    <Stack direction="row" gap={1} flexWrap="wrap">
      {data.map((item) => (
        <Button
          key={item.id}
          component={RouterLink}
          to={getResourceById(resources.Giveaway, item.id)}
          variant="outlined"
          color="secondary"
        >
          {t('giveaways.open')} · {item.prizeTitle}
        </Button>
      ))}
    </Stack>
  );
}
