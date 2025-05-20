'use client';
import React, { useEffect, useState } from 'react';

const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function ProjectListPage({ onOpenProject }: { onOpenProject: (projectId: string) => void }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('access_token');
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`${apiBaseUrl}/collabs/projects`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => {
        setProjects(data.data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim() || !token) return;
    const res = await fetch(`${apiBaseUrl}/collabs/projects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newProjectName }),
    });
    if (res.ok) {
      setNewProjectName('');
      setShowCreate(false);
      // Refresh project list
      // const data = await res.json();
      setProjects(prev => [...prev, newProjectName]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded shadow w-full max-w-lg">
        <h1 className="text-2xl text-black font-bold mb-6 text-center">Your Projects</h1>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <>
            <ul className="mb-6">
              {projects.map((project: any) => (
                <li
                  key={project._id}
                  className="flex text-black justify-between items-center p-3 border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => onOpenProject(project._id)}
                >
                  <span className="font-medium">{project.name}</span>
                  <button
                    className="text-blue-600 hover:underline"
                    onClick={e => {
                      e.stopPropagation();
                      onOpenProject(project._id);
                    }}
                  >
                    Open
                  </button>
                </li>
              ))}
            </ul>
            {showCreate ? (
              <form onSubmit={handleCreateProject} className="flex gap-2">
                <input
                  type="text"
                  className="border px-2 py-1 rounded flex-1 text-black"
                  placeholder="Project name"
                  value={newProjectName}
                  onChange={e => setNewProjectName(e.target.value)}
                  required
                />
                <button type="submit" className="bg-blue-600 text-white px-4 py-1 rounded">
                  Create
                </button>
                <button
                  type="button"
                  className="bg-gray-200 px-3 py-1 rounded"
                  onClick={() => setShowCreate(false)}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <button
                className="w-full bg-blue-600 text-white py-2 rounded mt-2"
                onClick={() => setShowCreate(true)}
              >
                + New Project
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}