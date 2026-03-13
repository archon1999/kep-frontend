import { useMemo, useState } from 'react';
import { Button, Card, CardContent, CardHeader, Grid, IconButton, InputAdornment, TextField } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider';
import { useChangePassword } from '../../application/mutations';
import IconifyIcon from 'shared/components/base/IconifyIcon';

const PasswordForm = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { trigger, isMutating } = useChangePassword();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showFields, setShowFields] = useState({ old: false, neu: false, confirm: false });

  const passwordsMismatch = useMemo(() => newPassword !== confirmPassword, [newPassword, confirmPassword]);

  const handleSave = async () => {
    if (!username) return;
    if (passwordsMismatch) {
      toast.error(t('settings.confirmNewPasswordIncorrect'));
      return;
    }

    try {
      await trigger({ username, payload: { oldPassword, newPassword } });
      toast.success(t('settings.saved'));
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch {
      toast.error(t('settings.wrongPassword'));
    }
  };

  const renderPasswordField = (
    label: string,
    value: string,
    onChange: (value: string) => void,
    visibleKey: keyof typeof showFields,
  ) => (
    <TextField
      fullWidth
      label={label}
      type={showFields[visibleKey] ? 'text' : 'password'}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={() => setShowFields((prev) => ({ ...prev, [visibleKey]: !prev[visibleKey] }))}>
              <IconifyIcon icon={showFields[visibleKey] ? 'material-symbols:visibility-off' : 'material-symbols:visibility'} />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardHeader title={t('settings.changePassword')} />
      <CardContent>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            {renderPasswordField(t('settings.oldPassword'), oldPassword, setOldPassword, 'old')}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {renderPasswordField(t('settings.newPassword'), newPassword, setNewPassword, 'neu')}
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            {renderPasswordField(t('settings.retypeNewPassword'), confirmPassword, setConfirmPassword, 'confirm')}
          </Grid>
        </Grid>
        <Button
          sx={{ mt: 3 }}
          variant="contained"
          onClick={handleSave}
          disabled={!username || isMutating}
        >
          {t('settings.change')}
        </Button>
      </CardContent>
    </Card>
  );
};

export default PasswordForm;
