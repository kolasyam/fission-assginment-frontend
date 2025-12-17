'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { eventAPI } from '../lib/api';
import toast from 'react-hot-toast';
import type { Event } from '../types';
interface EventFormProps {
  event?: Event;
  isEdit?: boolean;
}
export default function EventForm({ event, isEdit = false }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date ? new Date(event.date).toISOString().split('T')[0] : '',
    time: event?.time || '',
    location: event?.location || '',
    capacity: event?.capacity || '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(event?.imageUrl || '');
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('date', formData.date);
      data.append('time', formData.time);
      data.append('location', formData.location);
      data.append('capacity', formData.capacity.toString());
      if (imageFile) {
        data.append('image', imageFile);
      }
      if (isEdit && event) {
        await eventAPI.updateEvent(event._id, data);
        toast.success('Event updated successfully!');
        router.push('/dashboard');
      } else {
        await eventAPI.createEvent(data);
        toast.success('Event created successfully!');
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Title *
        </label>
        <input
          type="text"
          name="title"
          required
          value={formData.title}
          onChange={handleChange}
          className="input-field text-black"
          placeholder="Enter event title"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description *
        </label>
        <textarea
          name="description"
          required
          value={formData.description}
          onChange={handleChange}
          rows={4}
          className="input-field resize-none text-black"
          placeholder="Describe your event"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date *
          </label>
          <input
            type="date"
            name="date"
            required
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            className="input-field text-black"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Time *
          </label>
          <input
            type="time"
            name="time"
            required
            value={formData.time}
            onChange={handleChange}
            className="input-field text-black"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Location *
        </label>
        <input
          type="text"
          name="location"
          required
          value={formData.location}
          onChange={handleChange}
          className="input-field text-black"
          placeholder="Event location"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Capacity *
        </label>
        <input
          type="number"
          name="capacity"
          required
          min="1"
          value={formData.capacity}
          onChange={handleChange}
          className="input-field text-black"
          placeholder="Maximum number of attendees"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Event Image {!isEdit && '*'}
        </label>
        <input
          type="file"
          accept="image/*"
          required={!isEdit}
          onChange={handleImageChange}
          className="input-field text-black"
        />
        {imagePreview && (
          <div className="mt-4">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? 'Saving...' : isEdit ? 'Update Event' : 'Create Event'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="btn-secondary cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}