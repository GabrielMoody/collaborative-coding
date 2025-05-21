'use client';
import { useRef, useEffect, useState } from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  fileContent: string;
  setFileContent: (content: string) => void;
  connection: any;
  selectedFileId: string | null;
  selectedFileName: string | null;
}

interface LanguageInfo {
  id: string;
  aliases?: string[];
  extensions?: string[];
}

function getExtension(filename: string | null): string {
  if (!filename) return 'js';
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop()!.toLowerCase() : 'js';
}

export default function CodeEditor({
  fileContent,
  setFileContent,
  connection,
  selectedFileId,
  selectedFileName,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);
  const [languageName, setLanguageName] = useState<string>('JavaScript');

  const extension = getExtension(selectedFileName);
  const defaultLanguage = 'javascript';

  const handleEditorChange = (value: string | undefined) => {
    if (typeof value === 'string') {
      if (connection && selectedFileId) {
        const doc = connection.get('files', selectedFileId);
        doc.submitOp([{ p: ['content'], od: fileContent, oi: value }]);
      }
      setFileContent(value);
    }
  };

  const handleEditorDidMount = (editor: any, monaco: any) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Set initial full language name
    const langInfo = getLanguageInfo(monaco, extension);
    setLanguageName(langInfo?.aliases?.[0] || langInfo?.id || 'Unknown');
  };

  const getLanguageInfo = (monaco: any, ext: string): LanguageInfo | undefined => {
    return monaco.languages.getLanguages().find((lang: LanguageInfo) =>
      lang.extensions?.includes(`.${ext}`)
    );
  };

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      const newExt = getExtension(selectedFileName);
      const newLanguageInfo = getLanguageInfo(monacoRef.current, newExt);
      const newLanguageId = newLanguageInfo?.id || defaultLanguage;

      const model = editorRef.current.getModel();
      if (model) {
        monacoRef.current.editor.setModelLanguage(model, newLanguageId);
        setLanguageName(newLanguageInfo?.aliases?.[0] || newLanguageId);
      }
    }
  }, [selectedFileName]);

  return (
    <main className="flex-1 p-4 relative">
      <h2 className="text-lg font-semibold mb-2">
        {selectedFileName
          ? `Editing: ${selectedFileName} (${languageName})`
          : 'Select a file to edit'}
      </h2>
      <div className="relative w-full h-full">
        <MonacoEditor
          height="80vh"
          defaultLanguage={defaultLanguage}
          value={fileContent}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            fontFamily: 'monospace',
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
          }}
        />
      </div>
    </main>
  );
}
