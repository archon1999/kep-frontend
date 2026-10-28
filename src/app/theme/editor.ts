import type { BeforeMount } from '@monaco-editor/react';

export const registerEditorThemes: BeforeMount = (monaco) => {
  monaco.editor.defineTheme('kep-dark', {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '7F9A9F' },
      { token: 'keyword', foreground: '93D7E2' },
      { token: 'string', foreground: 'EACC9C' },
      { token: 'number', foreground: 'C6CDA5' },
      { token: 'type', foreground: 'C5CBD9' },
    ],
    colors: {
      'editor.background': '#0E121A',
      'editor.foreground': '#F5F6F8',
      'editor.lineHighlightBackground': '#131821',
      'editor.lineHighlightBorder': '#131821',
      'editorLineNumber.foreground': '#6C7B8D',
      'editorLineNumber.activeForeground': '#AEB5C0',
      'editorCursor.foreground': '#93D7E2',
      'editor.selectionBackground': '#25424E',
      'editor.inactiveSelectionBackground': '#1C2C36',
      'editorIndentGuide.background1': '#282E39',
      'editorIndentGuide.activeBackground1': '#4A6770',
      'editorWidget.background': '#131821',
      'editorWidget.border': '#282E39',
      'editorSuggestWidget.background': '#131821',
      'editorSuggestWidget.border': '#282E39',
      'editorSuggestWidget.selectedBackground': '#1C2C36',
    },
  });
  monaco.editor.defineTheme('kep-light', {
    base: 'vs',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '6C7F82' },
      { token: 'keyword', foreground: '296872' },
      { token: 'string', foreground: '89632E' },
      { token: 'number', foreground: '586B27' },
      { token: 'type', foreground: '566571' },
    ],
    colors: {
      'editor.background': '#FFFFFF',
      'editor.foreground': '#17232C',
      'editor.lineHighlightBackground': '#F0F4F5',
      'editor.lineHighlightBorder': '#F0F4F5',
      'editorLineNumber.foreground': '#74828C',
      'editorLineNumber.activeForeground': '#566571',
      'editorCursor.foreground': '#296872',
      'editor.selectionBackground': '#CCE5E8',
      'editor.inactiveSelectionBackground': '#E5ECEE',
      'editorIndentGuide.background1': '#E5ECEE',
      'editorIndentGuide.activeBackground1': '#A3BEC4',
      'editorWidget.background': '#FFFFFF',
      'editorWidget.border': '#D6E0E3',
      'editorSuggestWidget.background': '#FFFFFF',
      'editorSuggestWidget.border': '#D6E0E3',
      'editorSuggestWidget.selectedBackground': '#E4F3F5',
    },
  });
};
