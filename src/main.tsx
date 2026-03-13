import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'app/locales/i18n';
import BreakpointsProvider from 'app/providers/BreakpointsProvider';
import NotistackProvider from 'app/providers/NotistackProvider';
import SettingsPanelProvider from 'app/providers/SettingsPanelProvider';
import SettingsProvider from 'app/providers/SettingsProvider';
import ThemeProvider from 'app/providers/ThemeProvider';
import router from 'app/routes/router';
import SWRConfiguration from 'shared/services/configuration/SWRConfiguration';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <SWRConfiguration>
      <SettingsProvider>
        <ThemeProvider>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <NotistackProvider>
              <BreakpointsProvider>
                <SettingsPanelProvider>
                  <RouterProvider router={router} />
                </SettingsPanelProvider>
              </BreakpointsProvider>
            </NotistackProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </SettingsProvider>
    </SWRConfiguration>
  </React.StrictMode>,
);
