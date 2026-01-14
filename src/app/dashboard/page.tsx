'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { eventAPI } from '../lib/api';
import EventCard from '../components/EventCard';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Event } from '../types';
export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [myEvents, setMyEvents] = useState<Event[]>([]);
  const [attendingEvents, setAttendingEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'created' | 'attending'>('created');
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchUserEvents();
    }
  }, [user, authLoading, router]);

  const fetchUserEvents = async () => {
    try {
      setLoading(true);
      const [created, attending] = await Promise.all([
        eventAPI.getMyEvents(),
        eventAPI.getAttendingEvents(),
      ]);
      setMyEvents(created.data.events);
      setAttendingEvents(attending.data.events);
    } catch (error) {
      console.error('Error fetching user events:', error);
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return null;
  }
  const displayEvents = activeTab === 'created' ? myEvents : attendingEvents;
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">User Dashboard</h1>
        <p className="text-gray-600">Manage your events</p>
      </div>
      <div className="bg-white rounded-xl shadow-md mb-8">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('created')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors cursor-pointer ${
              activeTab === 'created'
                ? 'text-indigo-600 border-b-2 border-indigo-800'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            My Events ({myEvents.length})
          </button>
          <button
            onClick={() => setActiveTab('attending')}
            className={`flex-1 px-6 py-4 font-semibold transition-colors cursor-pointer ${
              activeTab === 'attending'
                ? 'text-indigo-600 border-b-2 border-indigo-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Attending ({attendingEvents.length})
          </button>
        </div>
      </div>
      {displayEvents.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl shadow-md">
          <div className="text-6xl mb-4">
            {activeTab === 'created' ? '📝' : '🎟️'}
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-2">
            {activeTab === 'created' ? 'No Events Created' : 'No Events Attended'}
          </h3>
          <p className="text-gray-600 mb-6">
            {activeTab === 'created'
              ? 'Create your first event and start inviting people!'
              : 'Browse events and RSVP to join the fun!'}
          </p>
          <button
            onClick={() => router.push(activeTab === 'created' ? '/create-event' : '/')}
            className="btn-primary"
          >
            {activeTab === 'created' ? 'Create Event' : 'Browse Events'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayEvents.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}