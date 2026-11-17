import { Box, Typography } from '@mui/material';
import type { CompetitionEventModel } from 'modules/contests/application/hooks/useCompetitionEvent';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { EventSection } from './EventSection';

const ruleIcons: Record<string, string> = {
  eligibility: 'mdi:school-outline',
  selection: 'mdi:account-multiple-check-outline',
  tracks: 'mdi:source-branch',
  scoring: 'mdi:podium',
  penalty: 'mdi:timer-outline',
  compilation: 'mdi:code-braces',
  freeze: 'mdi:snowflake',
  fairPlay: 'mdi:shield-check-outline',
  identity: 'mdi:card-account-details-outline',
  payment: 'mdi:wallet-outline',
  appeal: 'mdi:message-question-outline',
};

export const EventRules = ({ model }: { model: CompetitionEventModel }) => {
  const { event, copy, common } = model;
  return (
    <EventSection id="rules" title={common('sections.rules')}>
      <Typography variant="body1" sx={{ maxWidth: 850, lineHeight: 1.8 }}>
        {copy('eligibility')}
      </Typography>
      <Box className="event-rules">
        {event.ruleKeys.map((key) => (
          <Box key={key} className="event-rule">
            <IconifyIcon icon={ruleIcons[key]} sx={{ color: 'primary.main', fontSize: 26 }} />
            <Box sx={{ minWidth: 0 }}>
              <Typography component="h3" variant="subtitle1">
                {copy(`rules.${key}.title`)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {copy(`rules.${key}.body`)}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </EventSection>
  );
};
