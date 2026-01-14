'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { useAuth } from '../../context/AuthContext';
import { eventAPI, rsvpAPI } from '../../lib/api';
import LoadingSpinner from '../../components/LoadingSpinner';
import toast from 'react-hot-toast';
import type { Event } from '../../types';
export default function EventDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { user } = useAuth();
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  useEffect(() => {
    fetchEvent();
  }, [params.id]);
  const fetchEvent = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEvent(id);
      setEvent(response.data.event);
    } catch (error: any) {
      toast.error('Event not found');
      router.push('/');
    } finally {
      setLoading(false);
    }
  };
  const handleRSVP = async () => {
    if (!user) {
      toast.error('Please login to join');
      router.push('/login');
      return;
    }
    setActionLoading(true);
    try {
      const response = await rsvpAPI.rsvpToEvent(id);
      setEvent(response.data.event);
      toast.success('Successfully joined\'d to event!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to join');
    } finally {
      setActionLoading(false);
    }
  };
  const handleCancelRSVP = async () => {
    setActionLoading(true);
    try {
      const response = await rsvpAPI.cancelRsvp(id);
      setEvent(response.data.event);
      toast.success('Event cancelled successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to cancel event');
    } finally {
      setActionLoading(false);
    }
  };
  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this event?')) {
      return;
    }
    setActionLoading(true);
    try {
      await eventAPI.deleteEvent(id);
      toast.success('Event deleted successfully');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete event');
    } finally {
      setActionLoading(false);
    }
  };
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!event) {
    return null;
  }
  const isCreator = user && event.creator._id === user.id;
    const hasRSVPd =
    !!user &&
    event.attendees.some(
        (attendee: any) =>
        attendee === user.id || attendee?._id === user.id
    );
  const spotsLeft = event.capacity - event.currentAttendees;
  const isFull = spotsLeft <= 0;
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => router.back()}
        className="mb-6 text-gray-600 hover:text-gray-900 flex items-center space-x-2 cursor-pointer"
      >
        <span>←</span>
        <span>Back</span>
      </button>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="relative h-96 w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
            priority
          />
          {isFull && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Event Full
            </div>
          )}
          {!isFull && spotsLeft <= 10 && (
            <div className="absolute top-4 right-4 bg-orange-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
              Only {spotsLeft} spots left!
            </div>
          )}
        </div>
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {event.title}
              </h1>
              <div className="flex items-center space-x-2 text-gray-600 mb-4">
                <span className="text-sm">Created by</span>
                <span className="font-semibold text-primary-600">
                  {event.creator.name}
                </span>
              </div>
            </div>
            {isCreator && (
              <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
                <button
                  onClick={() => router.push(`/events/${event._id}/edit`)}
                  className="btn-primary cursor-pointer"
                  disabled={actionLoading}
                >
                  Edit Event
                </button>
                <button
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors cursor-pointer"
                  disabled={actionLoading}
                >
                  Delete Event
                </button>
              </div>
            )}
            {!isCreator && user && (
              <div className="mt-4 md:mt-0">
                {hasRSVPd ? (
                  <button
                    onClick={handleCancelRSVP}
                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-6 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                    disabled={actionLoading}
                  >
                    {actionLoading ? 'Cancelling...' : 'Cancel event'}
                  </button>
                ) : (
                  <button
                    onClick={handleRSVP}
                    className="btn-primary disabled:opacity-50 cursor-pointer"
                    disabled={actionLoading || isFull}
                  >
                    {actionLoading ? 'Processing...' : isFull ? 'Event Full' : 'RSVP Now'}
                  </button>
                )}
              </div>
            )}
            {!user && (
              <button
                onClick={() => router.push('/login')}
                className="btn-primary mt-4 md:mt-0"
              >
                Login to Join
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span>📅</span>
                <span>Date & Time</span>
              </h3>
              <p className="text-gray-700">
                {format(new Date(event.date), 'EEEE, MMMM dd, yyyy')}
              </p>
              <p className="text-gray-700 mt-1">at {event.time}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span>📍</span>
                <span>Location</span>
              </h3>
              <p className="text-gray-700">{event.location}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span>👥</span>
                <span>Capacity</span>
              </h3>
              <div className="space-y-2">
                <p className="text-gray-700">
                  <span className="font-semibold">{event.currentAttendees}</span> / {event.capacity} attendees
                </p>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      isFull ? 'bg-red-500' : spotsLeft <= 10 ? 'bg-orange-500' : 'bg-primary-500'
                    }`}
                    style={{ width: `${(event.currentAttendees / event.capacity) * 100}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {isFull ? 'Event is full' : `${spotsLeft} spots remaining`}
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span>ℹ️</span>
                <span>Status</span>
              </h3>
              <div className="space-y-2">
                {hasRSVPd && (
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    ✓ You are attending
                  </div>
                )}
                {!hasRSVPd && !isCreator && (
                  <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
                    ✓ You are not attending
                  </div>
                )}
                {isCreator && (
                  <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium inline-block ml-2">
                    Your Event
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">About This Event</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>
          {event.currentAttendees > 0 && (
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">
                Attendees ({event.currentAttendees})
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-600 text-sm">
                  {event.currentAttendees} {event.currentAttendees === 1 ? 'person has' : 'people have'} joined to this event
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
