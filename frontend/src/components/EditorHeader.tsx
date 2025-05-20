import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Plus } from 'lucide-react';
import SearchUser from './SearchUser';

interface EditorHeaderProps {
  projectName: string;
  ownerName: string;
  collaborators: { username: string }[];
}

const base_url = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EditorHeader({ projectName, ownerName, collaborators }: EditorHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [confirmUser, setConfirmUser] = useState<any>(null); // user to confirm
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Dynamically search users as the user types
  const handleUserSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(`${base_url}/users/search?username=${query}`);
      if (res.ok) {
        const data = await res.json();
        setSearchResults(data.users || []);
      } else {
        setSearchResults([]);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  const addContributor = async (userId: string) => {
    // Example: replace 'projectId' with your actual project ID
    try {
      const res = await fetch(`${base_url}/collabs/projects/test/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Assuming you store the token in localStorage   
        },
        body: JSON.stringify({ 
          userId,
          access: "read/write"
         }),
      });

      if (res.ok) {
        setShowSearch(false);
        setConfirmUser(null);
        // Optionally update collaborators list or show a success message
      } else {
        alert('Failed to add collaborator');
      }
    } catch {
      alert('Failed to add collaborator');
    }
  };

  const handleSearch = (query: string) => {
    setShowSearch(false);
  };

  return (
    <header className="flex items-center justify-between p-4 bg-gray-900 text-white">
      <div className="space-y-1">
        <h1 className="text-xl font-semibold">Project: {projectName}</h1>
        <p className="text-sm text-gray-300">Owner: {ownerName}</p>
      </div>
      <div className="flex items-center gap-4">
        {collaborators.map((c, i) => (
          <Avatar key={i} className="h-8 w-8">
            <AvatarFallback>{c.username[0]}</AvatarFallback>
          </Avatar>
        ))}
        <div className="relative">
          <Button
            className="flex items-center gap-2"
            onClick={() => setShowSearch((prev) => !prev)}
          >
            <Plus className="w-4 h-4" /> Add Collaborator
          </Button>
          {showSearch && (
            <div className="absolute right-0 mt-2 bg-white p-2 rounded shadow z-10 min-w-[250px]">
              <SearchUser
                onSearch={handleSearch}
                onInputChange={handleUserSearch}
              />
              {searchLoading && <div className="text-xs text-gray-500 mt-2">Searching...</div>}
              {!searchLoading && searchResults.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-auto">
                  {searchResults.map((user) => (
                    <li
                      key={user._id}
                      onClick={() => setConfirmUser(user)}
                      className="px-2 py-1 hover:bg-gray-100 cursor-pointer rounded text-black"
                    >
                      {user.username}
                    </li>
                  ))}
                </ul>
              )}
              {!searchLoading && searchResults.length === 0 && (
                <div className="text-xs text-gray-400 mt-2">No users found.</div>
              )}
            </div>
          )}
          {/* Confirmation Popup */}
          {confirmUser && (
            <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-30">
              <div className="bg-white rounded shadow-lg p-6 min-w-[300px]">
                <div className="mb-4 text-black">
                  Add <b>{confirmUser.username}</b> as a collaborator?
                </div>
                <div className="flex justify-between gap-2">
                  <Button
                    onClick={() => addContributor(confirmUser._id)}
                  >
                    Add
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setConfirmUser(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}