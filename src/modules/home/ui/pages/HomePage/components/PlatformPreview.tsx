import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { Alert, Button, ButtonBase, Chip, Skeleton, Tab, Tabs, Typography } from '@mui/material';
import { getResourceById, resources } from 'app/routes/resources';
import { useFeaturedHomeProblems } from 'modules/home/application/queries';
import IconifyIcon from 'shared/components/base/IconifyIcon';
import { WorkspacePane, WorkspaceToolbar } from 'shared/components/sections/common/Workspace';

const snippets = {
  Python: 'import sys\n\na, b = map(int, sys.stdin.read().split())\nprint(a + b)',
  'C++':
    '#include <iostream>\nusing namespace std;\n\nint main() {\n    long long a, b;\n    cin >> a >> b;\n    cout << a + b;\n}',
};

export const CodeSample = () => {
  const { t } = useTranslation();
  const [language, setLanguage] = useState<keyof typeof snippets>('Python');
  return (
    <WorkspacePane className="kep-code-sample">
      <WorkspaceToolbar className="kep-code-toolbar">
        <Tabs
          value={language}
          onChange={(_, value) => setLanguage(value)}
          aria-label={t('homePage.landing.language')}
        >
          <Tab label="Python" value="Python" />
          <Tab label="C++" value="C++" />
        </Tabs>
        <Chip variant="soft" color="neutral" label={t('homePage.landing.example')} />
      </WorkspaceToolbar>
      <pre aria-label={t('homePage.landing.codeSample')}>
        <code>
          {snippets[language].split('\n').map((line, index) => (
            <span className="kep-code-line" key={index}>
              <span aria-hidden="true">{index + 1}</span>
              <span>{line || ' '}</span>
            </span>
          ))}
        </code>
      </pre>
      <div className="kep-sample-output">
        <div>
          <Typography variant="label" color="text.secondary">
            {t('homePage.landing.input')}
          </Typography>
          <code>2 3</code>
        </div>
        <div>
          <Typography variant="label" color="text.secondary">
            {t('homePage.landing.output')}
          </Typography>
          <code>5</code>
        </div>
        <IconifyIcon icon="mdi:check" color="success.main" sx={{ ml: 'auto' }} aria-hidden="true" />
      </div>
    </WorkspacePane>
  );
};

export const ProblemPreview = ({ onSelect }: { onSelect?: (id: number) => void }) => {
  const { t } = useTranslation();
  const { data, isLoading, error, mutate } = useFeaturedHomeProblems();
  return (
    <div className="kep-problem-preview">
      <div className="kep-preview-label">
        <Typography variant="label" component="span" color="text.secondary">
          {t('homePage.landing.catalog')}
        </Typography>
        <Typography variant="label" component="span" color="text.secondary">
          {t('homePage.landing.rating')}
        </Typography>
      </div>
      {isLoading ? (
        Array.from({ length: 5 }, (_, i) => <Skeleton key={i} height={52} />)
      ) : error ? (
        <Alert
          severity="error"
          action={<Button onClick={() => void mutate()}>{t('homePage.landing.retry')}</Button>}
        >
          {t('homePage.landing.loadError')}
        </Alert>
      ) : data?.length ? (
        data.map((problem) => {
          const content = (
            <>
              <Typography component="span" variant="caption" color="text.secondary">
                {String(problem.id).padStart(3, '0')}
              </Typography>
              <Typography component="span" variant="body2" noWrap>
                {problem.title}
              </Typography>
              <Typography
                component="span"
                variant="metric"
                color="primary"
                sx={{ fontSize: '1rem' }}
              >
                {problem.problemRating ?? '—'}
              </Typography>
              <IconifyIcon
                icon="mdi:arrow-top-right"
                className="kep-row-arrow"
                aria-hidden="true"
              />
            </>
          );
          return onSelect ? (
            <ButtonBase
              key={problem.id}
              type="button"
              id={'featured-open-' + problem.id}
              className="kep-problem-row"
              onClick={() => onSelect(problem.id)}
            >
              {content}
            </ButtonBase>
          ) : (
            <Link
              key={problem.id}
              to={getResourceById(resources.Problem, problem.id)}
              className="kep-problem-row"
            >
              {content}
            </Link>
          );
        })
      ) : (
        <p className="kep-empty">{t('homePage.landing.empty')}</p>
      )}
      <Link className="kep-text-link" to={resources.Problems}>
        {t('homePage.landing.allProblems')}{' '}
        <IconifyIcon icon="mdi:arrow-top-right" aria-hidden="true" />
      </Link>
    </div>
  );
};
