'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import EventForm from '../components/EventForm';
import LoadingSpinner from '../components/LoadingSpinner';
export default function CreateEventPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }
  if (!user) {
    return null;
  }
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
        <p className="text-gray-600">Fill in the details to create your event</p>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <EventForm />
      </div>
    </div>
  );
}
