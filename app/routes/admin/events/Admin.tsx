import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '~/components/lib/api';
import AdminLayout from '../root';

interface Event {
  id: string;
  title: string;
  date: string;
  isBookingClosed: boolean;
}

const ManageEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [isBookingClosed, setIsBookingClosed] = useState(false);

  const fetchEvents = async () => {
    const res = await api.get('/events');
    setEvents(res.data);
  };

  const handleAddEvent = async () => {
    if (!name || !date) {
      toast.error('Event name and date are required');
      return;
    }
    await api.post('/events', { title: name, date: date, isBookingClosed: isBookingClosed });
    toast.success('Event Added');
    setName('');
    setDate('');
    setIsBookingClosed(false);
    fetchEvents();
  };

  const handleDeleteEvent = async (id: string) => {
    await api.delete(`/events/${id}`);
    toast.success('Event Deleted');
    fetchEvents();
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Events / Visits</h1>

      <div className="mb-6 space-y-2">
        <h2 className="text-lg font-semibold">Add New Event / Visits</h2>
        <input
          type="text"
          placeholder="Event Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={isBookingClosed}
            onChange={(e) => setIsBookingClosed(e.target.checked)}
          />
          <span>Close Booking on this date</span>
        </label>
        <button
          onClick={handleAddEvent}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Event
        </button>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Name</th>
            <th className="p-2">Date</th>
            <th className="p-2">Booking Closed</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id} className="border-b">
              <td className="p-2">{event.title}</td>
              <td className="p-2">{new Date(event.date).toLocaleDateString()}</td>
              <td className="p-2">{event.isBookingClosed ? 'Yes' : 'No'}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </AdminLayout>
  );
};

export default ManageEvents;
