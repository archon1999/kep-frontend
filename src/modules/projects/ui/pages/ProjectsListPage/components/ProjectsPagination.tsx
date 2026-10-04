import { useTranslation } from 'react-i18next';
import { Link, Pagination, Stack, TablePagination } from '@mui/material';
import { useBreakpoints } from 'app/providers/BreakpointsProvider';
import { PROJECT_PAGE_SIZE } from '../project-listing';

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
  const { up } = useBreakpoints();
  const rowsPerPage = showAll ? Math.max(1, count) : PROJECT_PAGE_SIZE;

  return (
    <TablePagination
      component="div"
      count={count}
      page={page - 1}
      showFirstButton
      showLastButton
      rowsPerPage={rowsPerPage}
      rowsPerPageOptions={[]}
      onPageChange={(_, nextPage) => onPageChange(nextPage + 1)}
      ActionsComponent={() => (
        <Stack
          direction="row"
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            ml: { sm: 1 },
            flexWrap: { xs: 'wrap', sm: 'nowrap' },
            rowGap: 1,
          }}
        >
          <Link
            component="button"
            variant="caption"
            onClick={onToggleShowAll}
            sx={{ fontWeight: 700, flexShrink: 0, mt: { sm: 0.5 } }}
          >
            {t(showAll ? 'projects.viewLess' : 'projects.showAll')}
          </Link>
          <Pagination
            color="primary"
            variant="solid"
            siblingCount={up('sm') ? 1 : 0}
            showFirstButton={up('sm')}
            showLastButton={up('sm')}
            count={Math.max(1, Math.ceil(count / rowsPerPage))}
            page={page}
            onChange={(_, nextPage) => onPageChange(nextPage)}
            sx={{ flexShrink: 0 }}
          />
        </Stack>
      )}
      sx={{ bgcolor: 'background.paper' }}
    />
  );
};

export default ProjectsPagination;
