import React, { useState } from 'react';

interface SearchUserProps {
  onSearch: (query: string) => void;
  onInputChange?: (query: string) => void;
}

const SearchUser: React.FC<SearchUserProps> = ({ onSearch, onInputChange }) => {
  const [query, setQuery] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (onInputChange) onInputChange(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      <input
        type="text"
        placeholder="Search user..."
        value={query}
        onChange={handleChange}
        className="border rounded px-2 py-1 text-black"
      />
    </form>
  );
};

export default SearchUser;