import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert, Box, IconButton, Stack, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import type { PairReview } from 'modules/admin/domain/entities/integrity.types';
import IconifyIcon from 'shared/components/base/IconifyIcon';

export default function SourceComparison({ data, names }: { data: PairReview; names: string[] }) {
  const { t, i18n } = useTranslation();
  const [block, setBlock] = useState(0);
  const panes = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const span = data.blocks[block];
    if (!span) return;
    panes.current.forEach((pane, index) => {
      const line = pane?.querySelector<HTMLElement>(`[data-line="${span[index * 2]}"]`);
      if (pane && line) pane.scrollTop = line.offsetTop - 36;
    });
  }, [data, block]);
  return (
    <Box>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
        <Typography variant="subtitle2">
          {t('admin.integrity.match', { index: block + 1, count: data.blocks.length })}
        </Typography>
        <Stack direction="row">
          <IconButton
            size="small"
            aria-label={t('admin.integrity.previous')}
            disabled={!block}
            onClick={() => setBlock((v) => v - 1)}
          >
            <IconifyIcon icon="mdi:chevron-left" />
          </IconButton>
          <IconButton
            size="small"
            aria-label={t('admin.integrity.next')}
            disabled={block + 1 >= data.blocks.length}
            onClick={() => setBlock((v) => v + 1)}
          >
            <IconifyIcon icon="mdi:chevron-right" />
          </IconButton>
        </Stack>
      </Stack>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: 'minmax(0,1fr)', md: 'repeat(2,minmax(0,1fr))' },
          gap: 1,
        }}
      >
        {data.sides.map((side, i) => (
          <Box
            key={i}
            sx={{
              minWidth: 0,
              border: 1,
              borderColor: 'divider',
              borderRadius: 1,
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{ p: 1.25, borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
            >
              <Typography variant="subtitle2">{names[i]}</Typography>
              {side && (
                <Typography variant="caption" color="text.secondary">
                  #{side.id} · {side.verdict} · {new Date(side.at).toLocaleString(i18n.language)}
                </Typography>
              )}
            </Box>
            {side ? (
              <Box
                ref={(el: HTMLDivElement | null) => {
                  panes.current[i] = el;
                }}
                tabIndex={0}
                role="region"
                aria-label={t('admin.integrity.source', { name: names[i] })}
                sx={{
                  position: 'relative',
                  height: { xs: 220, md: 350 },
                  overflow: 'auto',
                  fontFamily: 'monospace',
                  fontSize: 12,
                  lineHeight: '20px',
                  tabSize: 4,
                }}
              >
                <Box component="pre" sx={{ m: 0, font: 'inherit', minWidth: 'max-content', py: 1 }}>
                  {side.code.split(/\r?\n/).map((line, lineIndex) => {
                    const n = lineIndex + 1;
                    const offset = i * 2;
                    const active = data.blocks[block];
                    const focused = active && n >= active[offset] && n <= active[offset + 1];
                    const matched =
                      focused || data.blocks.some((b) => n >= b[offset] && n <= b[offset + 1]);
                    return (
                      <Box
                        component="span"
                        key={n}
                        data-line={n}
                        sx={(theme) => ({
                          display: 'block',
                          pr: 1,
                          borderInlineStart: '2px solid',
                          borderColor: focused ? 'primary.main' : 'transparent',
                          bgcolor: matched
                            ? alpha(theme.palette.primary.main, focused ? 0.2 : 0.08)
                            : undefined,
                        })}
                      >
                        <Box
                          component="span"
                          aria-hidden
                          sx={{
                            userSelect: 'none',
                            display: 'inline-block',
                            width: '4ch',
                            textAlign: 'right',
                            mr: 1.5,
                            color: 'text.secondary',
                          }}
                        >
                          {n}
                        </Box>
                        {line || ' '}
                      </Box>
                    );
                  })}
                </Box>
              </Box>
            ) : (
              <Alert severity="warning">{t('admin.integrity.sourceChanged')}</Alert>
            )}
          </Box>
        ))}
      </Box>
    </Box>
  );
}
