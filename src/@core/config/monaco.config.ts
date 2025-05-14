import { NgxMonacoEditorConfig } from 'ngx-monaco-editor-v2';

declare let monaco: any;

export function myMonacoLoad() {
  const keywords = ['ButunSon', 'KasrSon', 'Satr', 'Belgi', 'Agar', 'Yemasa', 'Sikl', 'uchun', 'dan', 'gacha', 'Toki', 'inkor', 'yoz'];
  const langName = 'kep';

  monaco.languages.register({id: langName});

  monaco.languages.setMonarchTokensProvider(langName, {
    keywords,
    brackets: [['{', '}', 'delimiter.curly'], ['(', ')', 'delimiter.curly']],
    tokenizer: {
      root: [
        [/[a-zA-Z_]\w*/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'variable',
          }
        }],
        [/#/, 'comment'],
        [/\'.?\'?/, 'char'],
        [/\".*\"?/, 'string'],
        [/[+-.\/*=%<>]/, 'operators'],
        [/\d+/, 'digit'],
        [/[{}()]/, 'brackets']
      ]
    }
  });

  monaco.editor.defineTheme('kepTheme', {
    base: 'vs',
    inherit: true,
    rules: [
      {token: 'keyword', fontStyle: 'bold'},
      {token: 'char', foreground: '#FF1493'},
      {token: 'variable', foreground: '#4b4acc'},
      {token: 'operators', foreground: '#7b30d0'},
      {token: 'digit', foreground: '#174781'},
      {token: 'brackets', foreground: '#0431fa'},
    ],
    colors: {
      'editor.foreground': '#000000'
    }
  });

  monaco.languages.registerCompletionItemProvider(langName, {
    provideCompletionItems: () => {
      const suggestions = [
        {
          label: 'agar',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'Agar ${1:shart} { \n\t$0\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        },
        {
          label: 'agaryemasa',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: ['Agar ${1:shart} {', '\t$0', '} Yemasa {', '\t', '}'].join('\n'),
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If-Else Statement'
        },
        {
          label: 'sikl',
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: 'Sikl ${1:i} uchun ${2:a} dan ${0:b} gacha {\n\t\n}',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'If-Else Statement'
        },
      ];
      for (const keyword of keywords) {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet
        });
      }
      return {suggestions: suggestions};
    }
  });

  monaco.languages.registerCompletionItemProvider('html', {
    triggerCharacters: ['>'],
    provideCompletionItems: (model, position) => {
      const codePre: string = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      });

      const tag = codePre.match(/.*<(\w+)>$/)?.[1];

      if (!tag) {
        return;
      }

      const word = model.getWordUntilPosition(position);

      return {
        suggestions: [
          {
            label: `</${tag}>`,
            kind: monaco.languages.CompletionItemKind.EnumMember,
            insertText: `$1</${tag}>`,
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range: {
              startLineNumber: position.lineNumber,
              endLineNumber: position.lineNumber,
              startColumn: word.startColumn,
              endColumn: word.endColumn,
            },
          },
        ],
      };
    },
  });


}

export const monacoConfig: NgxMonacoEditorConfig = {
  onMonacoLoad: myMonacoLoad,
};
