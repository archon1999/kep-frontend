import type { Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import type { AdminList } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ConsoleCell from '../../../shared/components/ConsoleCell';
import { fieldTitle, resourceTitle } from '../../../shared/helpers';

export default function ResourceTable({
  data,
  selected,
  setSelected,
  ordering,
  onOrderingChange,
}: {
  data: AdminList;
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  ordering: string;
  onOrderingChange: (value: string) => void;
}) {
  const { t } = useTranslation();
  const widths = data.columns.map((column) => {
    const kind = data.rows[0]?.cells[column.name]?.kind;
    if (column.name === 'id') return 96;
    if (kind === 'boolean') return 96;
    if (kind === 'number') return 112;
    if (kind === 'relation') return 176;
    if (kind === 'date' || kind === 'datetime') return 192;
    return /title|name|body|description/.test(column.name) ? 240 : 216;
  });
  const minimumWidth =
    widths.reduce((sum, width) => sum + width, 128) + (data.actions.length ? 48 : 0);
  return (
    <TableContainer
      role="region"
      tabIndex={0}
      aria-label={resourceTitle(t, data.resource)}
      sx={{ maxWidth: '100%', overflowX: 'auto', overscrollBehaviorX: 'contain' }}
    >
      <Table
        size="small"
        aria-label={resourceTitle(t, data.resource)}
        sx={{
          minWidth: minimumWidth,
          tableLayout: 'fixed',
          '& td, & th': { px: 2, py: 1.5, borderColor: 'divider' },
          '& tbody tr:hover': { bgcolor: 'action.hover' },
        }}
      >
        <colgroup>
          {data.actions.length > 0 && <Box component="col" sx={{ width: 48 }} />}
          {data.columns.map((column, index) => (
            <Box component="col" key={column.name} sx={{ width: widths[index] }} />
          ))}
          <Box component="col" sx={{ width: 128 }} />
        </colgroup>
        <TableHead>
          <TableRow>
            {data.actions.length > 0 && (
              <TableCell padding="checkbox">
                <Checkbox
                  inputProps={{ 'aria-label': t('admin.console.selectPage') }}
                  checked={
                    data.rows.length > 0 && data.rows.every((row) => selected.includes(row.id))
                  }
                  indeterminate={selected.length > 0 && selected.length < data.rows.length}
                  onChange={(_, checked) =>
                    setSelected(checked ? data.rows.map((row) => row.id) : [])
                  }
                />
              </TableCell>
            )}
            {data.columns.map((column) => (
              <TableCell key={column.name} sx={{ whiteSpace: 'nowrap' }}>
                {column.sortable ? (
                  <Button
                    size="small"
                    color="neutral"
                    onClick={() =>
                      onOrderingChange(ordering === column.name ? '-' + column.name : column.name)
                    }
                    sx={{ px: 0, minWidth: 0, textTransform: 'none' }}
                    endIcon={
                      ordering.replace('-', '') === column.name ? (
                        <IconifyIcon
                          icon={ordering.startsWith('-') ? 'mdi:arrow-down' : 'mdi:arrow-up'}
                        />
                      ) : undefined
                    }
                  >
                    {fieldTitle(t, column)}
                  </Button>
                ) : (
                  fieldTitle(t, column)
                )}
              </TableCell>
            ))}
            <TableCell align="right">{t('admin.columns.actions')}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.rows.map((row) => (
            <TableRow key={row.id} selected={selected.includes(row.id)}>
              {data.actions.length > 0 && (
                <TableCell padding="checkbox">
                  <Checkbox
                    checked={selected.includes(row.id)}
                    inputProps={{
                      'aria-label': t('admin.console.selectRecord', { name: row.label }),
                    }}
                    onChange={(_, checked) =>
                      setSelected((current) =>
                        checked ? [...current, row.id] : current.filter((id) => id !== row.id),
                      )
                    }
                  />
                </TableCell>
              )}
              {data.columns.map((column, index) => (
                <TableCell key={column.name}>
                  {index === 0 &&
                  !['secret', 'relation', 'link'].includes(row.cells[column.name]?.kind) ? (
                    <Button
                      component={Link}
                      color="neutral"
                      to={`${data.resource.path}/${encodeURIComponent(row.id)}`}
                      sx={{
                        justifyContent: 'flex-start',
                        textAlign: 'left',
                        p: 0,
                        minWidth: 0,
                      }}
                    >
                      <ConsoleCell cell={row.cells[column.name]} />
                    </Button>
                  ) : (
                    <ConsoleCell cell={row.cells[column.name]} />
                  )}
                </TableCell>
              ))}
              <TableCell align="right">
                <Button
                  size="small"
                  component={Link}
                  to={`${data.resource.path}/${encodeURIComponent(row.id)}`}
                  endIcon={<IconifyIcon icon="mdi:arrow-top-right" />}
                >
                  {t(
                    data.resource.permissions.change ? 'admin.actions.edit' : 'admin.console.view',
                  )}
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
