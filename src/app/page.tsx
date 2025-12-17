'use client';

import { useState, useEffect } from 'react';
import { eventAPI } from './lib/api';
import EventCard from './components/EventCard';
import SearchBar from './components/SearchBar';
import LoadingSpinner from './components/LoadingSpinner';
import type { Event } from './types';
export default function Home() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState({ search: '', date: '' });
  useEffect(() => {
    fetchEvents();
  }, [searchParams]);
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEvents(searchParams.search, searchParams.date);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };
  const handleSearch = (search: string, date: string) => {
    setSearchParams({ search, date });
  };
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
           main dashboard which display all upcoming events
        </h1>
        <p className="text-lg text-gray-600">
          Find and join events that match your interests
        </p>
      </div>
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <LoadingSpinner />
      ) : events.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🎭</div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            No Events Found
          </h3>
          <p className="text-gray-600">
            {searchParams.search || searchParams.date
              ? 'Try adjusting your search criteria'
              : 'Be the first to create an event!'}
          </p>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Upcoming Events ({events.length})
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}