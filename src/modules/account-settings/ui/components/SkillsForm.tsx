import { useEffect, useMemo, useState } from 'react';
import {
  Autocomplete,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  LinearProgress,
  Slider,
  Stack,
  TextField,
  Typography,
  createFilterOptions,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { useAuth } from 'app/providers/AuthProvider';
import type {
  AccountSkills,
  SkillCatalogItem,
  UserSkillItem,
} from '../../domain/entities/account-settings.entity';
import { useAccountSkillCatalog, useAccountSkills } from '../../application/queries';
import { useUpdateSkills } from '../../application/mutations';

const filterOptions = createFilterOptions<SkillCatalogItem>();

const normalizeSkillName = (value: string) => value.trim().replace(/\s+/g, ' ').toLowerCase();

const SkillsForm = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const username = currentUser?.username;

  const { data, isLoading, mutate } = useAccountSkills(username);
  const { data: catalog = [], isLoading: isCatalogLoading } = useAccountSkillCatalog();
  const { trigger, isMutating } = useUpdateSkills();

  const [formState, setFormState] = useState<AccountSkills>([]);
  const [inputValue, setInputValue] = useState('');

  const catalogByName = useMemo(() => {
    const map = new Map<string, SkillCatalogItem>();
    catalog.forEach((item) => {
      map.set(normalizeSkillName(item.name), item);
      map.set(normalizeSkillName(item.nameEn), item);
      map.set(normalizeSkillName(item.nameRu), item);
      map.set(normalizeSkillName(item.nameUz), item);
      map.set(normalizeSkillName(item.slug.replace(/-/g, ' ')), item);
    });
    return map;
  }, [catalog]);

  useEffect(() => {
    if (data) {
      setFormState(data.map((item) => ({ ...item })));
    }
  }, [data]);

  const addSkill = (value: SkillCatalogItem | string | null) => {
    if (!value) return;

    const catalogSkill =
      typeof value === 'string' ? catalogByName.get(normalizeSkillName(value)) ?? null : value;
    const rawName = typeof value === 'string' ? value : value.name;
    const normalizedName = normalizeSkillName(rawName);

    if (!normalizedName) return;

    setFormState((prev) => {
      const alreadyExists = prev.some((item) =>
        catalogSkill
          ? item.skillId === catalogSkill.skillId
          : normalizeSkillName(item.name) === normalizedName,
      );
      if (alreadyExists) {
        toast.error(t('settings.skillsDuplicate'));
        return prev;
      }

      const nextItem: UserSkillItem = catalogSkill
        ? {
            skillId: catalogSkill.skillId,
            slug: catalogSkill.slug,
            name: catalogSkill.name,
            labels: catalogSkill.labels,
            isCustom: false,
            level: 50,
          }
        : {
            name: rawName.trim().replace(/\s+/g, ' '),
            isCustom: true,
            level: 50,
          };

      return [...prev, nextItem];
    });

    setInputValue('');
  };

  const handleSlider = (index: number) => (_: Event, value: number | number[]) => {
    const nextValue = Array.isArray(value) ? value[0] : value;
    setFormState((prev) => prev.map((item, itemIndex) => (itemIndex === index ? { ...item, level: nextValue } : item)));
  };

  const handleRemove = (index: number) => {
    setFormState((prev) => prev.filter((_, itemIndex) => itemIndex !== index));
  };

  const handleReset = () => {
    setFormState(data ? data.map((item) => ({ ...item })) : []);
    setInputValue('');
  };

  const handleSave = async () => {
    if (!username) return;
    try {
      await trigger({
        username,
        payload: formState.map((item) => ({
          ...item,
          name: item.name.trim().replace(/\s+/g, ' '),
        })),
      });
      await mutate();
      toast.success(t('settings.saved'));
    } catch {
      toast.error(t('settings.error'));
    }
  };

  return (
    <Card sx={{ outline: 'none', borderRadius: 3 }} background={1}>
      <CardHeader title={t('settings.skills')} />
      <CardContent>
        {isLoading || isCatalogLoading || isMutating ? <LinearProgress sx={{ mb: 3 }} /> : null}
        <Stack direction="column" spacing={4}>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ xs: 'stretch', sm: 'flex-start' }}>
            <Autocomplete
              fullWidth
              freeSolo
              options={catalog}
              value={null}
              inputValue={inputValue}
              onInputChange={(_, value) => setInputValue(value)}
              onChange={(_, value) => addSkill(value)}
              filterOptions={(options, params) => filterOptions(options, params)}
              getOptionLabel={(option) => (typeof option === 'string' ? option : option.name)}
              isOptionEqualToValue={(option, value) =>
                typeof value !== 'string' && option.skillId === value.skillId
              }
              renderInput={(params) => (
                <TextField {...params} label={t('settings.skillsAutocomplete')} placeholder={t('settings.skillsAutocompletePlaceholder')} />
              )}
            />
            <Button variant="outlined" onClick={() => addSkill(inputValue)} disabled={!inputValue.trim()}>
              {t('settings.addSkill')}
            </Button>
          </Stack>

          {formState.length ? (
            <Stack direction="column" spacing={2}>
              {formState.map((skill, index) => (
                <Card key={`${skill.skillId ?? skill.name}-${index}`} variant="outlined">
                  <CardContent>
                    <Stack direction="column" spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                        <Stack direction="row" spacing={1} alignItems="center" useFlexGap flexWrap="wrap">
                          <Typography variant="subtitle1">{skill.name}</Typography>
                          {skill.isCustom ? (
                            <Chip size="small" label={t('settings.customSkill')} />
                          ) : null}
                        </Stack>
                        <Button color="secondary" onClick={() => handleRemove(index)}>
                          {t('settings.removeSkill')}
                        </Button>
                      </Stack>
                      <Divider />
                      <Stack direction="column" spacing={1}>
                        <Typography variant="body2" color="text.secondary">
                          {t('settings.skillLevel')}
                        </Typography>
                        <Slider
                          value={skill.level ?? 0}
                          onChange={handleSlider(index)}
                          valueLabelDisplay="auto"
                          min={0}
                          max={100}
                        />
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              {t('settings.skillsEmpty')}
            </Typography>
          )}

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" color="secondary" onClick={handleReset} disabled={isLoading}>
              {t('settings.reset')}
            </Button>
            <Button variant="contained" onClick={handleSave}>
              {t('settings.save')}
            </Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default SkillsForm;
