import type { MouseEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { Box, CircularProgress, IconButton, Stack, Tooltip } from '@mui/material';
import { useContestFinalistMutation } from 'modules/contests/application/mutations';
import type { ContestantEntity } from 'modules/contests/domain/entities/contestant.entity';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { toast } from 'sonner';

interface Props {
  contestId: number;
  contestant: ContestantEntity;
  finalistsEnabled: boolean;
  canSelectFinalists: boolean;
  canModerate: boolean;
  tabIndex: number;
  onModerate: (contestant: ContestantEntity) => void;
}

function preserveGridFocus(event: MouseEvent<HTMLButtonElement>) {
  event.preventDefault();
  event.stopPropagation();
}

function FinalistButton({
  contestId,
  contestantId,
  selected,
  tabIndex,
}: {
  contestId: number;
  contestantId: number;
  selected: boolean;
  tabIndex: number;
}) {
  const { t } = useTranslation();
  const { trigger, isMutating } = useContestFinalistMutation(contestId, contestantId);
  const label = t(selected ? 'contests.finalists.remove' : 'contests.finalists.add');

  return (
    <Tooltip title={label} describeChild>
      <span>
        <IconButton
          size="small"
          aria-label={label}
          aria-pressed={selected}
          tabIndex={tabIndex}
          disabled={isMutating}
          color={selected ? 'warning' : 'default'}
          onMouseDown={preserveGridFocus}
          onClick={async (event) => {
            event.stopPropagation();
            try {
              await trigger(!selected);
              toast.success(
                t(selected ? 'contests.finalists.removed' : 'contests.finalists.added'),
              );
            } catch {
              toast.error(t('contests.finalists.saveError'));
            }
          }}
        >
          {isMutating ? (
            <CircularProgress size={17} />
          ) : (
            <IconifyIcon icon={selected ? 'mdi:trophy' : 'mdi:trophy-outline'} fontSize={19} />
          )}
        </IconButton>
      </span>
    </Tooltip>
  );
}

export default function ContestantActions({
  contestId,
  contestant,
  finalistsEnabled,
  canSelectFinalists,
  canModerate,
  tabIndex,
  onModerate,
}: Props) {
  const { t } = useTranslation();
  const { id, rowType, isVirtual, isDisqualified, isFinalist, hasContestExclusion } = contestant;
  if (!id || rowType === 'upsolve' || isVirtual) return null;

  const showModeration = canModerate && (!isDisqualified || hasContestExclusion);
  const showFinalist = finalistsEnabled && !isDisqualified && (canSelectFinalists || isFinalist);
  if (!showModeration && !showFinalist) return null;

  const moderationLabel = t(
    hasContestExclusion ? 'admin.integrity.reinstate' : 'admin.integrity.exclude',
  );
  const finalistLabel = t('contests.finalists.qualified');

  return (
    <Stack direction="row" alignItems="center" sx={{ flexShrink: 0 }}>
      {showFinalist &&
        (canSelectFinalists ? (
          <FinalistButton
            contestId={contestId}
            contestantId={id}
            selected={Boolean(isFinalist)}
            tabIndex={tabIndex}
          />
        ) : (
          <Tooltip title={finalistLabel}>
            <Box
              component="span"
              role="img"
              aria-label={finalistLabel}
              sx={{ display: 'inline-flex', px: 0.5, color: 'warning.main' }}
            >
              <IconifyIcon icon="mdi:trophy" fontSize={19} />
            </Box>
          </Tooltip>
        ))}
      {showModeration && (
        <Tooltip title={moderationLabel} describeChild>
          <IconButton
            size="small"
            aria-label={moderationLabel}
            tabIndex={tabIndex}
            sx={{ '&:hover': { color: hasContestExclusion ? 'success.main' : 'error.main' } }}
            onMouseDown={preserveGridFocus}
            onClick={(event) => {
              event.stopPropagation();
              onModerate(contestant);
            }}
          >
            <IconifyIcon icon={hasContestExclusion ? 'mdi:restore' : 'mdi:cancel'} fontSize={19} />
          </IconButton>
        </Tooltip>
      )}
    </Stack>
  );
}
