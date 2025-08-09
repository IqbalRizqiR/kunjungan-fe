import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '~/components/lib/api';
import AdminLayout from '../root';

interface Session {
  id: string;
  startTime: string;
  endTime: string;
}

const ManageSessions = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchSessions = async () => {
    const res = await api.get('/sessions');
    setSessions(res.data);
  };

  const handleAddSession = async () => {
    if (!startTime || !endTime) {
      toast.error('Start and End Time are required');
      return;
    }

    await api.post('/sessions', { startTime, endTime });
    toast.success('Session Added');
    setStartTime('');
    setEndTime('');
    fetchSessions();
  };

  const handleDeleteSession = async (id: string) => {
    await api.delete(`/admin/sessions/${id}`);
    toast.success('Session Deleted');
    fetchSessions();
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Sessions</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New Session</h2>
        <div className="flex space-x-2">
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="border p-2 rounded"
          />
          <button onClick={handleAddSession} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Start Time</th>
            <th className="p-2">End Time</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sessions.filter((session) => session.startTime && session.endTime !== '00:00').map((session) => (
            <tr key={session.id} className="border-b">
              <td className="p-2">{session.startTime}</td>
              <td className="p-2">{session.endTime}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDeleteSession(session.id)}
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

export default ManageSessions;
