'use client';
import { useState } from 'react';
interface SearchBarProps {
  onSearch: (search: string, date: string) => void;
}
export default function SearchBar({ onSearch }: SearchBarProps) {
  const [search, setSearch] = useState('');
  const [date, setDate] = useState('');
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(search, date);
  };
  const handleClear = () => {
    setSearch('');
    setDate('');
    onSearch('', '');
  };
  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, description, or location..."
            className="input-field text-black"
          />
        </div>
        <div>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="input-field text-black"
          />
        </div>
      </div> 
      <div className="flex gap-3 mt-4">
        <button type="submit" className="btn-primary cursor-pointer">
          🔍 Search
        </button>
        <button type="button" onClick={handleClear} className="btn-secondary cursor-pointer">
          Clear
        </button>
      </div>
    </form>
  );
}