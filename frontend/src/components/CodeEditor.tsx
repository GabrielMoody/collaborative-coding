import { useRef } from 'react';
import MonacoEditor from '@monaco-editor/react';

interface CodeEditorProps {
  fileContent: string;
  setFileContent: (content: string) => void;
  connection: any;
  selectedFileId: string | null;
  selectedFileName: string | null;
}

export default function CodeEditor({
  fileContent,
  setFileContent,
  connection,
  selectedFileId,
  selectedFileName,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (value: string | undefined) => {
    if (typeof value === 'string') {
      if (connection && selectedFileId) {
        const doc = connection.get('files', selectedFileId);
        doc.submitOp([{ p: ['content'], od: fileContent, oi: value }]);
      }
      setFileContent(value);
    }
  };

  return (
    <main className="flex-1 p-4 relative">
      <h2 className="text-lg font-semibold mb-2">
        {selectedFileName ? `Editing: ${selectedFileName}` : 'Select a file to edit'}
      </h2>
      <div className="relative w-full h-full">
        <MonacoEditor
          height="80vh"
          defaultLanguage="javascript"
          value={fileContent}
          onChange={handleEditorChange}
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