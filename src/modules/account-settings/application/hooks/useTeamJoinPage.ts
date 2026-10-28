import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router';
import { resources } from 'app/routes/resources';
import { useJoinTeam } from 'modules/account-settings/application';
import { toast } from 'sonner';

export const useTeamJoinPage = () => {
  const { t } = useTranslation();

  const navigate = useNavigate();

  const { id } = useParams();

  const { trigger, isMutating } = useJoinTeam();

  const [error, setError] = useState('');

  const teamCode = id?.trim() ?? '';

  const handleJoin = async () => {
    if (!teamCode) return;

    setError('');

    try {
      await trigger(teamCode);
      toast.success(t('settings.saved'));
      navigate(resources.SettingsTeams);
    } catch {
      setError(t('settings.teamJoinFailed'));
    }
  };
  return { navigate, isMutating, teamCode, handleJoin, error };
};
