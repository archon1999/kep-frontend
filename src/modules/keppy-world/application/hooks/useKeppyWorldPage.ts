import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from 'app/providers/AuthProvider';
import { useGameAudio } from 'modules/games/application';
import { useWorldExperience } from 'modules/keppy-world/application';

export const useKeppyWorldPage = () => {
  const { t } = useTranslation();

  const { currentUser, isAuthLoading } = useAuth();

  const game = useWorldExperience(currentUser?.username);

  const [entered, setEntered] = useState(false);

  const [panel, setPanel] = useState<
    'profile' | 'ranking' | 'quests' | 'run' | 'map' | 'growth' | null
  >(null);

  const [mascot, setMascot] = useState('keppy');

  const [cosmetic, setCosmetic] = useState('none');

  const audio = useGameAudio('keppy-world', entered && game.connection.status === 'connected');

  const profile = game.data?.player;

  const run = game.run;

  useEffect(() => {
    if (profile) {
      setMascot(profile.mascotId);
      setCosmetic(profile.equippedCosmetic);
    }
  }, [profile?.mascotId, profile?.equippedCosmetic]);

  const saveProfile = () => game.saveProfile({ mascotId: mascot, equippedCosmetic: cosmetic });

  const resetProfileDraft = useCallback(() => {
    setMascot(profile?.mascotId ?? 'keppy');
    setCosmetic(profile?.equippedCosmetic ?? 'none');
  }, [profile?.mascotId, profile?.equippedCosmetic]);

  const openPanel = useCallback(
    (next: typeof panel) => {
      if (next === 'profile') resetProfileDraft();
      setPanel(next);
    },
    [resetProfileDraft],
  );

  const closePanel = () => {
    if (panel === 'profile') resetProfileDraft();
    setPanel(null);
  };

  const selectQuest = async (id: string) => {
    if (run && !['completed', 'expired', 'abandoned'].includes(run.status)) {
      setPanel('run');
      return;
    }
    const claimed = await game.claim(id);
    if (claimed) setPanel('run');
  };

  const errorKey =
    game.actionError &&
    t(`keppyWorld.errors.${game.actionError}`, { defaultValue: t('keppyWorld.requestFailed') });

  const connectionStatus = game.connection.status;

  const completedRun = run?.status === 'completed';
  return {
    currentUser,
    isAuthLoading,
    game,
    audio,
    entered,
    setEntered,
    profile,
    run,
    saveProfile,
    resetProfileDraft,
    openPanel,
    closePanel,
    selectQuest,
    errorKey,
    connectionStatus,
    completedRun,
    mascot,
    setMascot,
    cosmetic,
    setCosmetic,
    panel,
    setPanel,
  };
};
