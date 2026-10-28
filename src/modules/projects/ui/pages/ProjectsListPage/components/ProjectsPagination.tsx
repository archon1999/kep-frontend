import { useTranslation } from 'react-i18next';
import { Box, Button, Stack } from '@mui/material';
import { PROJECT_PAGE_SIZE } from 'modules/projects/application/project-listing';
import { RouteListPagination } from 'shared/components/sections/common/FramedListPage';

interface ProjectsPaginationProps {
  count: number;
  page: number;
  showAll: boolean;
  onPageChange: (page: number) => void;
  onToggleShowAll: () => void;
}
const ProjectsPagination = ({
  count,
  page,
  showAll,
  onPageChange,
  onToggleShowAll,
}: ProjectsPaginationProps) => {
  const { t } = useTranslation();
  return (
    <Stack
      direction="row"
      alignItems="center"
      flexWrap="wrap"
      sx={{ px: 'var(--kep-content-inset)', py: 1 }}
    >
      {count > PROJECT_PAGE_SIZE && (
        <Button variant="text" onClick={onToggleShowAll}>
          {t(showAll ? 'projects.viewLess' : 'projects.showAll')}
        </Button>
      )}
      {!showAll && (
        <Box sx={{ flex: '1 1 240px' }}>
          <RouteListPagination
            page={page}
            count={Math.ceil(count / PROJECT_PAGE_SIZE)}
            onChange={onPageChange}
          />
        </Box>
      )}
    </Stack>
  );
};
export default ProjectsPagination;
