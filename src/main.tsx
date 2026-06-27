import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import 'app/locales/i18n';
import BreakpointsProvider from 'app/providers/BreakpointsProvider';
import NotistackProvider from 'app/providers/NotistackProvider';
import SettingsPanelProvider from 'app/providers/SettingsPanelProvider';
import SettingsProvider from 'app/providers/SettingsProvider';
import ThemeProvider from 'app/providers/ThemeProvider';
import VisionModeProvider from 'app/providers/VisionModeProvider';
import router from 'app/routes/router';
import 'devicon/devicon.min.css';
import { AppErrorBoundary } from 'modules/errors/ui';
import { DateTimeLocalizationProvider } from 'shared/lib/dateTime';
import SWRConfiguration from 'shared/services/configuration/SWRConfiguration';

const isMonacoCancellation = (reason: unknown) => {
  if (!reason || typeof reason !== 'object') {
    return false;
  }

  const candidate = reason as { type?: unknown; msg?: unknown; message?: unknown };
  return (
    candidate.type === 'cancelation' &&
    (candidate.msg === 'operation is manually canceled' ||
      candidate.message === 'operation is manually canceled')
  );
};

window.addEventListener('unhandledrejection', (event) => {
  if (isMonacoCancellation(event.reason)) {
    event.preventDefault();
  }
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppErrorBoundary>
      <SWRConfiguration>
        <SettingsProvider>
          <VisionModeProvider>
            <ThemeProvider>
              <DateTimeLocalizationProvider>
                <NotistackProvider>
                  <BreakpointsProvider>
                    <SettingsPanelProvider>
                      <RouterProvider router={router} />
                    </SettingsPanelProvider>
                  </BreakpointsProvider>
                </NotistackProvider>
              </DateTimeLocalizationProvider>
            </ThemeProvider>
          </VisionModeProvider>
        </SettingsProvider>
      </SWRConfiguration>
    </AppErrorBoundary>
  </React.StrictMode>,
);
