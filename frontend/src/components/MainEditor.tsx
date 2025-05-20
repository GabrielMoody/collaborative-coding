'use client';
import React, { useState, useEffect } from 'react';
import EditorHeader from '@/components/EditorHeader';
import FileSideBar from '@/components/FileSideBar';
import CodeEditor from '@/components/CodeEditor';
import 'prismjs/themes/prism.css';
import sharedb from 'sharedb/lib/client';
import ReconnectingWebSocket from 'reconnecting-websocket';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function MainEditor({projectName}: { projectName: string }) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string>('');
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [connection, setConnection] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [project, setProject] = useState<string>('');
  const [owner, setOwner] = useState<string>('');
  const [collaborators, setCollaborators] = useState<any[]>([]);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;

    async function fetchFiles() {
      setLoading(true);
      try {
        const res = await fetch(`${apiBaseUrl}/collabs/projects/${projectName}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error('Failed to fetch files');
        const data = await res.json();
        setFiles(data.data.files || []);
        setProject(data.data.project || '');
        setOwner(data.data.owner.username || '');
        setCollaborators(data.data.collaborators || []);
      } catch (err) {
        console.error('Error fetching files:', err);
        setProject({});
      } finally {
        setLoading(false);
      }
    }
    fetchFiles();
  }, [token]);

  useEffect(() => {
    if (!token) return;

    // Only run in browser
    if (typeof window === 'undefined') return;

    const wsUrl = `ws://localhost:8000?token=${token}`;
    const socket = new ReconnectingWebSocket(wsUrl);
    const shareConnection = new sharedb.Connection(socket as any);
    setConnection(shareConnection);

    return () => {
      shareConnection.close();
      socket.close();
    };
  }, [token]);

  const handleFileClick = (file: any) => {
    setSelectedFile(file.name);
    setSelectedFileId(file.id);
    
    const doc = connection.get('files', file.id);
    doc.subscribe((err: any) => {
      if (err) {
        console.error('Error subscribing to document:', err);
        return;
      }
      doc.on('op', (op: any) => {
        setFileContent(doc.data.content);
      });
      setFileContent(doc.data.content);
    });
    
  };

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => ({
      ...prev,
      [folderId]: !prev[folderId],
    }));
  };

  return (
    <div className="h-screen flex flex-col">
      <EditorHeader 
        projectName={project}
        ownerName={owner}
        collaborators={collaborators}
      /> 
      <div className="flex flex-1">
        <FileSideBar
          files={files}
          expandedFolders={expandedFolders}
          selectedFileId={selectedFileId}
          loading={loading}
          onFileClick={handleFileClick}
          onToggleFolder={toggleFolder}
        />
        <CodeEditor
          fileContent={fileContent || ''}
          selectedFileName={selectedFile}
          setFileContent={setFileContent}
          connection={connection}
          selectedFileId={selectedFileId}
         />
      </div>
    </div>
  );
}