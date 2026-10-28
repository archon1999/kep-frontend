import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import Editor from '@monaco-editor/react';
import {
  Box,
  Button,
  Chip,
  MenuItem,
  Select,
  Skeleton,
  Stack,
  Tab,
  Tabs,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { usePersistedCode } from 'modules/problems/application/hooks/usePersistedCode';
import { useProblemLanguage } from 'modules/problems/application/hooks/useProblemLanguage';
import type { ProblemDetail } from 'modules/problems/domain/entities/problem.entity';
import { ProblemBody } from 'modules/problems/ui/shared/components/problem-detail/ProblemBody';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import MixedText from 'shared/components/common/MixedText';
import { WorkspacePane, WorkspaceToolbar } from 'shared/components/sections/common/Workspace';
import { useMonacoTheme } from 'shared/hooks/useMonacoTheme';
import { useLoginHref } from 'shared/lib/authRedirect';
import { getItemFromStore, setItemToStore } from 'shared/lib/utils';

const editorLanguages: Record<string, string> = {
  py: 'python',
  cpp: 'cpp',
  c: 'c',
  java: 'java',
  cs: 'csharp',
  rs: 'rust',
  go: 'go',
  kt: 'kotlin',
  js: 'javascript',
  ts: 'typescript',
  php: 'php',
  hs: 'haskell',
  r: 'r',
};

const WorkspaceEditor = ({
  problem,
  lang,
  template,
}: {
  problem: ProblemDetail;
  lang: string;
  template: string;
}) => {
  const { t } = useTranslation();
  const codeTheme = useMonacoTheme();
  const loginHref = useLoginHref(getResourceById(resources.Problem, problem.id));
  const { initialCode, editorKey, persistCode, codeRef } = usePersistedCode({
    storageKey: `landing-problem-${problem.id}-${lang}-code`,
    template:
      template ||
      (lang === 'py'
        ? `import sys\n\ndef solve():\n    data = sys.stdin.read().split()\n    # ${t('homePage.landing.workspace.starter')}\n    pass\n\nif __name__ == "__main__":\n    solve()\n`
        : lang === 'cpp'
          ? `#include <iostream>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n    // ${t('homePage.landing.workspace.starter')}\n    return 0;\n}\n`
          : ''),
  });
  const carryDraftToWorkspace = () => {
    if (!codeRef.current.trim()) return;
    try {
      const storageKey = `problem-${problem.id}-code`;
      if (!getItemFromStore(storageKey, '')) {
        setItemToStore(storageKey, JSON.stringify(codeRef.current));
      }
    } catch {
      // The editable preview remains usable when browser storage is unavailable.
    }
  };
  return (
    <>
      <div className="kep-workspace-monaco">
        <Editor
          key={editorKey}
          height="100%"
          language={editorLanguages[lang] ?? lang}
          theme={codeTheme.theme}
          beforeMount={codeTheme.beforeMount}
          defaultValue={initialCode}
          onChange={(value) => persistCode(value ?? '')}
          loading={<Skeleton variant="rectangular" height={300} />}
          options={{
            ariaLabel: t('homePage.landing.workspace.editor'),
            minimap: { enabled: false },
            fontSize: 14,
            lineHeight: 24,
            padding: { top: 20, bottom: 16 },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            tabSize: 4,
            lineNumbersMinChars: 3,
            folding: false,
            overviewRulerLanes: 0,
            scrollbar: {
              verticalScrollbarSize: 5,
              horizontalScrollbarSize: 5,
              alwaysConsumeMouseWheel: false,
            },
          }}
        />
      </div>
      <div className="kep-workspace-editor-footer">
        <div>
          <Typography variant="caption" color="text.secondary">
            {t('homePage.landing.workspace.signInHint')}
          </Typography>
          <Link
            to={getResourceById(resources.Problem, problem.id)}
            onClick={carryDraftToWorkspace}
            className="kep-workspace-open"
          >
            {t('homePage.landing.workspace.fullWorkspace')}{' '}
            <IconifyIcon icon="mdi:arrow-top-right" aria-hidden="true" />
          </Link>
        </div>
        <Button
          component={Link}
          to={loginHref}
          onClick={carryDraftToWorkspace}
          variant="contained"
          className="kep-cta"
          endIcon={<IconifyIcon icon="mdi:arrow-top-right" aria-hidden="true" />}
        >
          {t('homePage.landing.workspace.continue')}
        </Button>
      </div>
    </>
  );
};

const InlineWorkspace = ({ problem }: { problem: ProblemDetail }) => {
  const { t } = useTranslation();
  const [mobileTab, setMobileTab] = useState('description');
  const isCompact = useMediaQuery('(max-width: 680px)');
  const { selectedLang, setSelectedLang, selectedLanguage } = useProblemLanguage({
    availableLanguages: problem.availableLanguages,
    defaultLang: 'py',
  });
  return (
    <div className="kep-inline-workspace">
      {isCompact && (
        <Tabs
          variant="fullWidth"
          value={mobileTab}
          onChange={(_, value) => setMobileTab(value)}
          aria-label={t('homePage.landing.workspace.title')}
          sx={{ flexShrink: 0, borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            value="description"
            label={t('problems.detail.problemTab')}
            id="inline-mobile-description"
            aria-controls="inline-description"
          />
          <Tab
            value="code"
            label={t('homePage.landing.workspace.editor')}
            id="inline-mobile-code"
            aria-controls="inline-code"
          />
        </Tabs>
      )}
      <WorkspacePane
        component="section"
        id="inline-description"
        className="kep-workspace-statement"
        hidden={isCompact && mobileTab !== 'description'}
        role={isCompact ? 'tabpanel' : undefined}
        aria-labelledby={isCompact ? 'inline-mobile-description' : undefined}
        aria-label={t('problems.detail.problemTab')}
      >
        {!isCompact && (
          <WorkspaceToolbar>
            <Typography variant="label" color="text.secondary">
              {t('problems.detail.problemTab')}
            </Typography>
          </WorkspaceToolbar>
        )}
        <Box className="kep-workspace-scroll" tabIndex={0}>
          <Typography component="h3" variant="h5">
            <MixedText>{problem.title}</MixedText>
          </Typography>
          <Stack direction="row" gap={1} flexWrap="wrap" sx={{ mt: 1.5, mb: 2.5 }}>
            <Chip
              variant="soft"
              color="primary"
              label={
                <>
                  {t('homePage.landing.rating')}{' '}
                  <Typography component="span" variant="metric" sx={{ fontSize: '1rem' }}>
                    {problem.problemRating ?? '—'}
                  </Typography>
                </>
              }
            />
            {problem.tags.slice(0, 3).map((tag) => (
              <Chip key={tag.id} variant="soft" color="neutral" label={tag.name} />
            ))}
          </Stack>
          <ProblemBody problem={problem} />
        </Box>
      </WorkspacePane>
      <WorkspacePane
        component="section"
        id="inline-code"
        className="kep-workspace-editor"
        hidden={isCompact && mobileTab !== 'code'}
        role={isCompact ? 'tabpanel' : undefined}
        aria-labelledby={isCompact ? 'inline-mobile-code' : undefined}
        aria-label={t('homePage.landing.workspace.editor')}
      >
        <WorkspaceToolbar sx={{ justifyContent: 'space-between' }}>
          <Typography
            variant="label"
            color="text.secondary"
            sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
          >
            <IconifyIcon icon="mdi:code-tags" aria-hidden="true" />
            {t('homePage.landing.workspace.editor')}
          </Typography>
          <Select
            inputProps={{ 'aria-label': t('homePage.landing.language') }}
            size="small"
            sx={{ maxWidth: '55%', '& .MuiSelect-select': { py: 0.75 } }}
            value={selectedLang}
            onChange={(event) => setSelectedLang(event.target.value)}
          >
            {problem.availableLanguages.map((language) => (
              <MenuItem key={language.lang} value={language.lang}>
                {language.langFull}
              </MenuItem>
            ))}
          </Select>
        </WorkspaceToolbar>
        <WorkspaceEditor
          key={problem.id + '-' + selectedLang}
          problem={problem}
          lang={selectedLang}
          template={selectedLanguage?.codeTemplate ?? ''}
        />
      </WorkspacePane>
    </div>
  );
};
export default InlineWorkspace;
