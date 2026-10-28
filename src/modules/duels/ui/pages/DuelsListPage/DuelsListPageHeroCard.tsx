import { ReactNode, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { Button, Stack, Typography } from '@mui/material';
import { useAuth } from 'app/providers/AuthProvider.tsx';
import { resources } from 'app/routes/resources.ts';
import { useCreateDuelCall } from 'modules/duels/application/mutations.ts';
import {
  isDuelsCollectionCacheKey,
  useDuelPresets,
  useDuelTypes,
} from 'modules/duels/application/queries.ts';
import { DuelsRatingRow } from 'modules/duels/domain/index.ts';
import DuelRecord from 'modules/duels/ui/shared/components/DuelRecord';
import { getDuelErrorMessage } from 'modules/duels/ui/shared/helpers/getDuelErrorMessage.ts';
import KepIcon from 'shared/components/base/KepIcon';
import PageHeader from 'shared/components/sections/common/PageHeader';
import useRouteQueryState from 'shared/hooks/useRouteQueryState';
import { useLoginRedirect } from 'shared/lib/authRedirect';
import { enumParam } from 'shared/lib/queryParams';
import { toast } from 'sonner';
import { useSWRConfig } from 'swr';
import DuelCreateCallDialog from './dialogs/DuelCreateCallDialog.tsx';

type HeroQueryState = {
  activeTab: 'my_duels' | 'waiting_room' | 'history' | '';
};

type Props = {
  userRating?: DuelsRatingRow;
  navigationComponent?: ReactNode;
};

const DuelsListPageHeroCard = ({ userRating, navigationComponent }: Props) => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const redirectToLogin = useLoginRedirect();
  const navigate = useNavigate();
  const { mutate: mutateCache } = useSWRConfig();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const {
    data: presets = [],
    isLoading: isPresetsLoading,
    error: presetsError,
    mutate: retryPresets,
  } = useDuelPresets(Boolean(currentUser && isCreateDialogOpen));
  const {
    data: duelTypes = [],
    isLoading: isTypesLoading,
    error: typesError,
    mutate: retryTypes,
  } = useDuelTypes(Boolean(currentUser && isCreateDialogOpen));
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
      <PageHeader
        variant="hero"
        navigationComponent={navigationComponent}
        title={t('duels.title')}
        subtitle={t('duels.queueHeroDescription')}
        actionComponent={
          <Stack spacing={1.5} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                variant="contained"
                startIcon={<KepIcon name="duel" fontSize={18} />}
                onClick={() => {
                  if (!currentUser) {
                    redirectToLogin();
                    return;
                  }
                  setIsCreateDialogOpen(true);
                }}
              >
                {t('duels.createDuel')}
              </Button>
              <Button
                variant="outlined"
                startIcon={<KepIcon name="ranking" fontSize={18} />}
                onClick={() => navigate(resources.DuelsRating)}
              >
                {t('duels.viewRating')}
              </Button>
            </Stack>

            {userRating ? (
              <Stack direction="row" spacing={1.25} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="metric" sx={{ fontSize: 28 }}>
                  {userRating.duels ?? 0}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t('duels.table.duels')}
                </Typography>
                <DuelRecord
                  wins={userRating.wins}
                  draws={userRating.draws}
                  losses={userRating.losses}
                />
              </Stack>
            ) : null}
          </Stack>
        }
      />

      <DuelCreateCallDialog
        open={isCreateDialogOpen}
        presets={presets}
        duelTypes={duelTypes}
        disabled={isCreatingCall}
        loading={isPresetsLoading || isTypesLoading}
        error={presetsError || typesError}
        onRetry={() => {
          void retryPresets();
          void retryTypes();
        }}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (payload) => {
          try {
            await createDuelCall(payload);
            toast.success(t('duels.callCreatedToast'));
            setField('activeTab', 'my_duels');
            await mutateCache(isDuelsCollectionCacheKey, undefined, { revalidate: true });
            setIsCreateDialogOpen(false);
          } catch (error) {
            toast.error(getDuelErrorMessage(error, t('duels.error')));
          }
        }}
      />
    </>
  );
};

export default DuelsListPageHeroCard;
