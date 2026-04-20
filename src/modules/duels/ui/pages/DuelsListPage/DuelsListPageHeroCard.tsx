import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { Button, Card, Stack, Typography } from '@mui/material';
import { useSWRConfig } from 'swr';
import { getResourceById, resources } from 'app/routes/resources.ts';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { enumParam } from 'shared/lib/queryParams';
import KepIcon from 'shared/components/base/KepIcon';
import { useCreateDuelCall } from 'modules/duels/application/mutations.ts';
import {
  isDuelsCollectionCacheKey,
  useDuelPresets,
  useDuelTypes,
} from 'modules/duels/application/queries.ts';
import DuelCreateCallDialog from './dialogs/DuelCreateCallDialog.tsx';

type HeroQueryState = {
  activeTab: 'my_duels' | 'waiting_room' | 'history' | '';
};

const DuelsListPageHeroCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { mutate: mutateCache } = useSWRConfig();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { data: presets = [] } = useDuelPresets();
  const { data: duelTypes = [] } = useDuelTypes();
  const { trigger: createDuelCall, isMutating: isCreatingCall } = useCreateDuelCall();
  const { setField } = useRouteQueryState<HeroQueryState>({
    defaults: {
      activeTab: '',
    },
    schema: {
      activeTab: {
        ...enumParam(['my_duels', 'waiting_room', 'history'] as const),
        param: 'tab',
      },
    },
    historyByKey: {
      activeTab: 'push',
    },
  });

  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          p: { xs: 2.5, md: 3 },
          background: 'linear-gradient(120deg, rgba(25,118,210,0.08), rgba(0,171,85,0.12))',
          border: '1px solid',
          borderColor: 'primary.lighter',
        }}
      >
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={3}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
        >
          <Stack spacing={1.5} direction="column">
            <Stack direction="row" spacing={1} alignItems="center">
              <KepIcon name="duels" fontSize={30} color="primary.main" />
              <Typography variant="h4" fontWeight={800}>
                {t('duels.title')}
              </Typography>
            </Stack>

            <Typography variant="body1" color="text.secondary" maxWidth={720}>
              {t('duels.queueHeroDescription')}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Button
              variant="contained"
              startIcon={<KepIcon name="duel" fontSize={18} />}
              onClick={() => setIsCreateDialogOpen(true)}
              sx={{ borderRadius: 999 }}
            >
              {t('duels.createDuel')}
            </Button>
            <Button
              variant="text"
              startIcon={<KepIcon name="ranking" fontSize={18} />}
              onClick={() => navigate(resources.DuelsRating)}
            >
              {t('duels.viewRating')}
            </Button>
          </Stack>
        </Stack>
      </Card>

      <DuelCreateCallDialog
        open={isCreateDialogOpen}
        presets={presets}
        duelTypes={duelTypes}
        disabled={isCreatingCall}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (payload) => {
          try {
            await createDuelCall(payload);
            toast.success(t('duels.callCreatedToast'));
            setField('activeTab', 'my_duels');
            await mutateCache(isDuelsCollectionCacheKey, undefined, { revalidate: true });
            setIsCreateDialogOpen(false);
          } catch {
            toast.error(t('duels.error'));
          }
        }}
      />
    </>
  );
};

export default DuelsListPageHeroCard;
