'use client';
import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import type { Event } from '../types';
interface EventCardProps {
  event: Event;
}
export default function EventCard({ event }: EventCardProps) {
  const spotsLeft = event.capacity - event.currentAttendees;
  const isFull = spotsLeft <= 0;
  return (
    <Link href={`/events/${event._id}`}>
      <div className="card overflow-hidden cursor-pointer transform hover:scale-[1.02] transition-all duration-300">
        <div className="relative h-48 w-full">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
          {isFull && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Full
            </div>
          )}
          {!isFull && spotsLeft <= 5 && (
            <div className="absolute top-2 right-2 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
              {spotsLeft} spots left
            </div>
          )}
        </div>
        <div className="p-5">
          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
            {event.title}
          </h3> 
          <p className="text-gray-600 text-sm mb-4 line-clamp-2">
            {event.description}
          </p>
          <div className="space-y-2 text-sm text-gray-700">
            <div className="flex items-center space-x-2">
              <span>📅</span>
              <span>{format(new Date(event.date), 'MMM dd, yyyy')} at {event.time}</span>
            </div>     
            <div className="flex items-center space-x-2">
              <span>📍</span>
              <span className="line-clamp-1">{event.location}</span>
            </div>           
            <div className="flex items-center space-x-2">
              <span>👥</span>
              <span>{event.currentAttendees} / {event.capacity} attendees</span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Created by <span className="font-semibold">{event.creator.name}</span>
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}