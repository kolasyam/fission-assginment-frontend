'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { eventAPI } from '../../../lib/api';
import EventForm from '../../../components/EventForm';
import LoadingSpinner from '../../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import type { Event } from '../../../types';
export default function EditEventPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    } else if (user) {
      fetchEvent();
    }
  }, [user, authLoading, params.id]);
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEvent(id);
      const fetchedEvent = response.data.event;
      if (user && fetchedEvent.creator._id !== user.id) {
        toast.error('You are not authorized to edit this event');
        router.push(`/events/${params.id}`);
        return;
      }
      setEvent(fetchedEvent);
    } catch (error: any) {
      toast.error('Event not found');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };
  if (authLoading || loading) {
    return <LoadingSpinner />;
  }
  if (!user || !event) {
    return null;
  }
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Edit Event</h1>
        <p className="text-gray-600">Update your event details</p>
      </div>
      <div className="bg-white rounded-xl shadow-lg p-8">
        <EventForm event={event} isEdit={true} />
      </div>
    </div>
  );
}