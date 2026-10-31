import { type Dispatch, type SetStateAction, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import {
  Box,
  Button,
  Checkbox,
  Chip,
  Menu,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip,
  Typography,
} from '@mui/material';
import type { AdminList, AdminRow } from 'modules/admin/domain';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import ConsoleCell from '../../../shared/components/ConsoleCell';
import ResourceActions from '../../../shared/components/ResourceActions';
import { fieldTitle, recordPath, resourceTitle } from '../../../shared/helpers';
import { listPresentation, semanticColor } from '../../../shared/helpers/resourcePresentation';

export default function ResourceTable({
  data,
  selected,
  setSelected,
  ordering,
  onOrderingChange,
  onAction,
  busy,
}: {
  data: AdminList;
  selected: string[];
  setSelected: Dispatch<SetStateAction<string[]>>;
  ordering: string;
  onOrderingChange: (value: string) => void;
  onAction: (action: string, ids: string[]) => void;
  busy?: boolean;
}) {
  const { t } = useTranslation();
  const presentation = listPresentation(data);
  const [customColumns, setColumns] = useState<string[] | null>(null);
  const [dense, setDense] = useState(false);
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const [sortAnchor, setSortAnchor] = useState<HTMLElement | null>(null);
  const names = (customColumns ?? presentation.defaults).filter((name) =>
    presentation.columns.includes(name),
  );
  const columns = names.map((name) => data.columns.find((column) => column.name === name)!);
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [...current, id],
    );
  const select = (row: AdminRow) => (
    <Checkbox
      disabled={busy}
      size="small"
      checked={selected.includes(row.id)}
      inputProps={{ 'aria-label': t('admin.console.selectRecord', { name: row.label }) }}
      onChange={() => toggle(row.id)}
    />
  );
  const identity = (row: AdminRow) => (
    <Box sx={{ minWidth: 0 }}>
      <Typography
        component={Link}
        to={recordPath(data.resource, row.id)}
        sx={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          color: 'text.primary',
          textDecoration: 'none',
          fontWeight: 650,
          fontSize: 14,
          lineHeight: 1.6,
          '&:hover': { color: 'primary.main' },
        }}
      >
        {row.cells[presentation.identity]?.display || row.label}
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        alignItems="center"
        sx={{ mt: 0.25, color: 'text.secondary', minWidth: 0 }}
      >
        {row.cells.id?.kind !== 'secret' && !row.id.startsWith('gAAAA') && (
          <Typography variant="caption" sx={{ flexShrink: 0, fontVariantNumeric: 'tabular-nums' }}>
            #{row.id}
          </Typography>
        )}
        {presentation.secondary && (
          <Typography variant="caption" noWrap>
            {row.cells[presentation.secondary]?.display}
          </Typography>
        )}
      </Stack>
    </Box>
  );
  const cell = (row: AdminRow, name: string) => {
    const value = row.cells[name];
    const color = value && semanticColor(name, value.display);
    if (color)
      return (
        <Chip
          size="small"
          variant="soft"
          color={color}
          label={value.display}
          sx={{ maxWidth: 1, '& .MuiChip-label': { overflow: 'hidden', textOverflow: 'ellipsis' } }}
        />
      );
    if (name === 'hidden' || name === 'in_the_pipeline')
      return (
        <Chip
          size="small"
          variant="soft"
          color={value?.value ? 'neutral' : 'success'}
          icon={<IconifyIcon icon={value?.value ? 'mdi:eye-off-outline' : 'mdi:earth'} />}
          label={t(
            value?.value
              ? name === 'hidden'
                ? 'admin.workspace.hidden'
                : 'admin.workspace.draft'
              : name === 'hidden'
                ? 'admin.workspace.visible'
                : 'admin.workspace.public',
          )}
        />
      );
    return <ConsoleCell cell={value} />;
  };
  const identityColumn = data.columns.find((column) => column.name === presentation.identity);
  const heading = (column: AdminList['columns'][number]) =>
    column.sortable ? (
      <TableSortLabel
        active={ordering.replace('-', '') === column.name}
        direction={ordering.startsWith('-') ? 'desc' : 'asc'}
        onClick={() => onOrderingChange(ordering === column.name ? '-' + column.name : column.name)}
      >
        {fieldTitle(t, column)}
      </TableSortLabel>
    ) : (
      fieldTitle(t, column)
    );
  return (
    <Box sx={{ containerType: 'inline-size', minWidth: 0 }}>
      <Stack
        direction="row"
        alignItems="center"
        gap={1}
        sx={{ px: { xs: 2, md: 3 }, py: 1, borderBottom: 1, borderColor: 'divider' }}
      >
        {data.actions.length > 0 && (
          <Box sx={{ '@container (min-width: 820px)': { display: 'none' } }}>
            <Checkbox
              disabled={busy}
              size="small"
              inputProps={{ 'aria-label': t('admin.console.selectPage') }}
              checked={data.rows.every((row) => selected.includes(row.id))}
              indeterminate={selected.length > 0 && selected.length < data.rows.length}
              onChange={(_, checked) => setSelected(checked ? data.rows.map((row) => row.id) : [])}
            />
          </Box>
        )}
        <Typography variant="caption" color="text.secondary" sx={{ flex: 1 }}>
          {t('admin.console.recordCount', { count: data.total })}
        </Typography>
        {data.columns.some((column) => column.sortable) && (
          <Button
            size="small"
            color="neutral"
            onClick={(event) => setSortAnchor(event.currentTarget)}
            startIcon={<IconifyIcon icon="mdi:sort" />}
            sx={{ '@container (min-width: 820px)': { display: 'none' } }}
          >
            {t('admin.workspace.sort')}
          </Button>
        )}
        <Tooltip title={t(dense ? 'admin.workspace.comfortable' : 'admin.workspace.compact')}>
          <Button
            color="neutral"
            size="small"
            onClick={() => setDense((value) => !value)}
            startIcon={
              <IconifyIcon icon={dense ? 'mdi:format-line-spacing' : 'mdi:format-line-weight'} />
            }
            sx={{ display: 'none', '@container (min-width: 820px)': { display: 'inline-flex' } }}
          >
            {t(dense ? 'admin.workspace.comfortable' : 'admin.workspace.compact')}
          </Button>
        </Tooltip>
        {presentation.columns.length > 0 && (
          <Button
            size="small"
            color="neutral"
            onClick={(event) => setAnchor(event.currentTarget)}
            startIcon={<IconifyIcon icon="mdi:view-column-outline" />}
          >
            {t('admin.workspace.columns')}
          </Button>
        )}
      </Stack>
      <Menu anchorEl={anchor} open={Boolean(anchor)} onClose={() => setAnchor(null)}>
        {presentation.columns.map((name) => (
          <MenuItem
            key={name}
            onClick={() =>
              setColumns(
                names.includes(name) ? names.filter((value) => value !== name) : [...names, name],
              )
            }
          >
            <Checkbox size="small" checked={names.includes(name)} tabIndex={-1} />
            {fieldTitle(t, data.columns.find((column) => column.name === name)!)}
          </MenuItem>
        ))}
        <MenuItem
          onClick={() => {
            setColumns(null);
            setAnchor(null);
          }}
        >
          {t('admin.workspace.resetColumns')}
        </MenuItem>
      </Menu>
      <Menu anchorEl={sortAnchor} open={Boolean(sortAnchor)} onClose={() => setSortAnchor(null)}>
        {data.columns
          .filter((column) => column.sortable)
          .map((column) => (
            <MenuItem
              key={column.name}
              selected={ordering.replace('-', '') === column.name}
              onClick={() => {
                onOrderingChange(ordering === column.name ? '-' + column.name : column.name);
                setSortAnchor(null);
              }}
            >
              {fieldTitle(t, column)}
              {ordering.replace('-', '') === column.name && (
                <IconifyIcon
                  icon={ordering.startsWith('-') ? 'mdi:arrow-down' : 'mdi:arrow-up'}
                  sx={{ ml: 1 }}
                />
              )}
            </MenuItem>
          ))}
      </Menu>
      <TableContainer
        sx={{
          display: 'none',
          '@container (min-width: 820px)': { display: 'block' },
          overflowX: 'auto',
        }}
        role="region"
        tabIndex={0}
        aria-label={resourceTitle(t, data.resource)}
      >
        <Table
          size="small"
          sx={{
            tableLayout: 'fixed',
            minWidth: 330 + columns.length * 100,
            '& td, & th': { borderColor: 'divider', py: dense ? 1 : 1.75, px: 1.5 },
            '& th': {
              fontSize: 12,
              color: 'text.secondary',
              bgcolor: 'action.hover',
              fontWeight: 600,
            },
            '& td': { fontSize: 13 },
            '& tbody tr:hover': { bgcolor: 'action.hover' },
          }}
        >
          <colgroup>
            {data.actions.length > 0 && <Box component="col" sx={{ width: 48 }} />}
            <Box component="col" sx={{ width: columns.length > 3 ? '30%' : '40%' }} />
            {columns.map((column) => (
              <Box component="col" key={column.name} />
            ))}
            <Box component="col" sx={{ width: 55 }} />
          </colgroup>
          <TableHead>
            <TableRow>
              {data.actions.length > 0 && (
                <TableCell padding="checkbox">
                  <Checkbox
                    disabled={busy}
                    size="small"
                    inputProps={{ 'aria-label': t('admin.console.selectPage') }}
                    checked={data.rows.every((row) => selected.includes(row.id))}
                    indeterminate={selected.length > 0 && selected.length < data.rows.length}
                    onChange={(_, checked) =>
                      setSelected(checked ? data.rows.map((row) => row.id) : [])
                    }
                  />
                </TableCell>
              )}
              <TableCell>
                {identityColumn ? heading(identityColumn) : t('admin.columns.name')}
              </TableCell>
              {columns.map((column) => (
                <TableCell key={column.name}>{heading(column)}</TableCell>
              ))}
              <TableCell aria-label={t('admin.columns.actions')} />
            </TableRow>
          </TableHead>
          <TableBody>
            {data.rows.map((row) => (
              <TableRow key={row.id} selected={selected.includes(row.id)}>
                {data.actions.length > 0 && <TableCell padding="checkbox">{select(row)}</TableCell>}
                <TableCell>{identity(row)}</TableCell>
                {columns.map((column) => (
                  <TableCell key={column.name}>{cell(row, column.name)}</TableCell>
                ))}
                <TableCell>
                  <ResourceActions
                    compact
                    recordLabel={row.label}
                    editPath={recordPath(data.resource, row.id)}
                    actions={data.actions}
                    busy={busy}
                    onAction={(action) => onAction(action, [row.id])}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box sx={{ '@container (min-width: 820px)': { display: 'none' } }}>
        {data.rows.map((row) => (
          <Box
            key={row.id}
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: selected.includes(row.id) ? 'action.selected' : undefined,
            }}
          >
            <Stack direction="row" alignItems="flex-start" gap={1}>
              {data.actions.length > 0 && select(row)}
              <Box sx={{ flex: 1, minWidth: 0 }}>{identity(row)}</Box>
              <ResourceActions
                compact
                recordLabel={row.label}
                editPath={recordPath(data.resource, row.id)}
                actions={data.actions}
                busy={busy}
                onAction={(action) => onAction(action, [row.id])}
              />
            </Stack>
            {columns.length > 0 && (
              <Box
                component="dl"
                sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 0, mt: 1.5 }}
              >
                {columns.map((column) => (
                  <Box key={column.name} sx={{ minWidth: 0 }}>
                    <Typography
                      component="dt"
                      variant="caption"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {fieldTitle(t, column)}
                    </Typography>
                    <Box component="dd" sx={{ m: 0, fontSize: 13 }}>
                      {cell(row, column.name)}
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
