'use client';
import { FileText, FolderIcon, ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FileSidebarProps {
  files: any[];
  expandedFolders: Record<string, boolean>;
  selectedFileId: string | null;
  loading: boolean;
  projectName: string | null;
  onFileClick: (file: any) => void;
  onToggleFolder: (folderId: string) => void;
}

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function FileSideBar({
  files,
  expandedFolders,
  selectedFileId,
  loading,
  onFileClick,
  onToggleFolder,
  projectName,
}: FileSidebarProps) {
  const [menuPos, setMenuPos] = useState<{ x: number; y: number } | null>(null);
  const [menuType, setMenuType] = useState<string | null>(null);
  const [menuItem, setMenuItem] = useState<any>(null);
  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState<string>('');
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Handle right click on file/folder/project
  const onRightClick = (e: React.MouseEvent, type: string, item: any = null) => {
    e.preventDefault();
    setMenuType(type);
    setMenuItem(item);
    setMenuPos({ x: e.pageX, y: e.pageY });
  };

  // Get full path
  function getFullPath(itemId: string, items = files, path: string[] = []): string | null {
    for (const item of items) {
      if (item.id === itemId) {
        return [...path, item.name].join('/');
      }
      if (item.type === 'folder' && item.children) {
        const result = getFullPath(itemId, item.children, [...path, item.name]);
        if (result) return result;
      }
    }
    return null;
  }

  // Handle menu action
  const handleMenuAction = (action: string) => {
    if (!menuItem) return;
    if (action.match(/create/i)) {
      setShowInput(true);
      setPendingAction(action);
      setMenuPos(null);
    } else if (action.match(/delete/i)) {
      setPendingAction(action);
      handleDelete();
      setMenuPos(null);
    } else {
      // Handle other actions (rename, delete, etc.) here
      setMenuPos(null);
      setMenuItem(null);
    }
  };

  // Handle submit for create folder/file
  const handleCreate = async () => {
    if (!menuItem || !pendingAction || !inputValue.trim()) return;
    const fullPath = getFullPath(menuItem.id);
    const body = {
      name: inputValue,
      type: pendingAction.split(' ')[1].toLowerCase(),
    };

    try {
      await fetch(`${apiBaseUrl}/collabs/projects/${projectName}/path/${fullPath}/create`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
    } catch (err) {
      console.error('Error creating file/folder:', err);
    }
    setShowInput(false);
    setInputValue('');
    setPendingAction(null);
    setMenuItem(null);
  };

  const handleDelete = async () => {
    if (!menuItem || !pendingAction) return;
    
    const fullPath = getFullPath(menuItem.id);
    const body = {
      fileName: menuItem.name,
      type: menuItem.type
    };

    try {
      const data = await fetch(`${apiBaseUrl}/collabs/projects/${projectName}/path/${fullPath}/delete`, {
        method: 'DELETE',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      console.log('Delete response:', data.json());
    } catch (err) {
      console.error('Error creating file/folder:', err);
    }
    setShowInput(false);
    setInputValue('');
    setPendingAction(null);
    setMenuItem(null);
  };

  const onClick = () => {
    if (menuPos) setMenuPos(null);
  };

  const renderContextMenu = () => {
    if (!menuPos || !menuType) return null;
    let options: string[] = [];
    if (menuType === 'project') {
      options = ['Create Folder', 'Create File'];
    } else if (menuType === 'folder') {
      options = [
        'Create Folder',
        'Create File',
        'Rename Folder',
        'Delete Folder',
      ];
    } else if (menuType === 'file') {
      options = ['Rename File', 'Delete File'];
    }
    return (
      <ul
        style={{
          position: 'absolute',
          top: menuPos.y,
          left: menuPos.x,
          background: '#fff',
          border: '1px solid #ccc',
          borderRadius: 4,
          padding: '8px 0',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          listStyle: 'none',
          margin: 0,
          zIndex: 1000,
          width: 180,
        }}
        onClick={onClick}
      >
        {options.map((opt) => (
          <li
            key={opt}
            className='text-black hover:bg-gray-200'
            style={{ padding: '6px 12px', cursor: 'pointer' }}
            onClick={() => handleMenuAction(opt)}
          >
            {opt}
          </li>
        ))}
      </ul>
    );
  };

  const renderInputForm = () => {
    if (!showInput) return null;
    return (
      <div
        style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.2)',
          zIndex: 2000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        onClick={() => setShowInput(false)}
      >
        <form
          onSubmit={e => {
            e.preventDefault();
            handleCreate();
          }}
          className="bg-white p-6 rounded shadow flex flex-col gap-3 min-w-[300px]"
          onClick={e => e.stopPropagation()}
        >
          <label className="text-black font-medium">
            {pendingAction?.includes('Folder') ? 'Folder Name' : 'File Name'}
          </label>
          <input
            autoFocus
            className="border px-2 py-1 rounded text-black"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            placeholder={pendingAction?.includes('Folder') ? 'New Folder' : 'New File'}
          />
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              className="px-3 py-1 rounded bg-gray-200"
              onClick={() => setShowInput(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 rounded bg-blue-600 text-white"
            >
              Create
            </button>
          </div>
        </form>
      </div>
    );
  };

  const renderFiles = (items: any[]) => (
    <ul className="space-y-1">
      {items.map((item) => {
        if (item.type === 'folder') {
          return (
            <li
              key={item.id}
              onContextMenu={e => {
                e.stopPropagation();
                onRightClick(e, 'folder', item);
              }}
            >
              <div
                className="flex text-black items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-200"
                onClick={() => onToggleFolder(item.id)}
              >
                {expandedFolders[item.id] ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                <FolderIcon className="w-4 h-4" />
                <span>{item.name}</span>
              </div>
              {expandedFolders[item.id] && item.children && (
                <div className="pl-6">{renderFiles(item.children)}</div>
              )}
            </li>
          );
        } else {
          return (
            <li
              key={item.id}
              onContextMenu={e => {
                e.stopPropagation();
                onRightClick(e, 'file', item);
              }}
              onClick={() => onFileClick(item)}
              className={`flex text-black items-center gap-2 p-2 rounded cursor-pointer hover:bg-gray-200 ${
                selectedFileId === item.id ? 'bg-gray-200 font-medium' : ''
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>{item.name}</span>
            </li>
          );
        }
      })}
    </ul>
  );

  return (
    <aside
      className="w-64 bg-gray-100 p-4 border-r"
      onContextMenu={e => {
        if (e.target === e.currentTarget) onRightClick(e, 'project');
      }}
      onClick={onClick}
      style={{ position: 'relative' }}
    >
      <h2 className="text-sm font-semibold mb-2 text-black">Files</h2>
      {loading ? <p>Loading files...</p> : renderFiles(files)}
      {renderContextMenu()}
      {renderInputForm()}
    </aside>
  );
}