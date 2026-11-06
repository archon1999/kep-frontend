import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Tab, Tabs } from '@mui/material';
import { useAdminRegistry } from 'modules/admin/application';
import { resourceTitle } from '../helpers';
import { resourceWorkspaces } from '../helpers/resourceRelations';

export default function ResourceRelatedTabs({ resourceKey }: { resourceKey: string }) {
  const { t } = useTranslation();
  const { data: catalog = [] } = useAdminRegistry();
  const group = resourceWorkspaces.find((items) => items.includes(resourceKey));
  const items =
    group?.flatMap((key) => {
      const resource = catalog.find((item) => item.key === key);
      return resource ? [resource] : [];
    }) ?? [];
  if (items.length < 2) return null;
  return (
    <Tabs
      value={resourceKey}
      variant="scrollable"
      allowScrollButtonsMobile
      aria-label={t('admin.workspace.relatedRecords')}
      sx={{
        px: { xs: 1, md: 2 },
        borderBottom: 1,
        borderColor: 'divider',
        minHeight: 40,
        '& .MuiTab-root': { minHeight: 40, fontSize: 12, px: 1.5 },
      }}
    >
      {items.map((resource) => (
        <Tab
          key={resource.key}
          value={resource.key}
          component={Link}
          to={resource.path}
          label={resourceTitle(t, resource)}
        />
      ))}
    </Tabs>
  );
}
