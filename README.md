MINI EVENT PLATFORM
A full-stack event management platform built with React.js(Next.js, TypeScript), Node.js, Express.js, and MongoDB. Users can create events, RSVP to events, and manage their attendance with real-time capacity tracking and concurrency handling.

User Authentication
-Secure JWT-based authentication
-User registration and login
-Protected routes and API endpoints

Event Management
-Create events with title, description, date, time, location, capacity, and image
-Edit and delete own events
-View all upcoming events
-Search and filter events by keyword and date
-Image upload with Cloudinary integration

RSVP System
-RSVP to events with capacity enforcement
-Cancel RSVP functionality
-Real-time attendee count
-Concurrency handling to prevent overbooking (race condition prevention)
-One RSVP per user per event

User Dashboard

-View events created by user
-View events user is attending
-Quick access to event management

Responsive Design
-Fully responsive UI using Tailwind CSS
-Mobile, tablet, and desktop optimized
-Modern card-based layout
-Interactive hover effects

Concurrency Handling - Code

using MongoDB Transactions
const session = await mongoose.startSession();
session.startTransaction();
Atomic Updates with Conditions
const updatedEvent = await Event.findOneAndUpdate(
  {
    _id: eventId,
    currentAttendees: { $lt: event.capacity }, // Check capacity atomically
    attendees: { $ne: userId } // Ensure user not already registered
  },
  {
    $push: { attendees: userId },
    $inc: { currentAttendees: 1 }
  },
  {
    new: true,
    session
  }
);