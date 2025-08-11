import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '~/components/lib/api';
import AdminLayout from '../root';

interface Tujuan {
  id: string;
  name: string;
}

const ManageTujuan = () => {
  const [tujuan, setTujuan] = useState<Tujuan[]>([]);
  const [newTujuan, setNewTujuan] = useState<string>('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const fetchTujuan = async () => {
    const res = await api.get('/tujuan');
    setTujuan(res.data);
  };

  const handleAddTujuan = async () => {
    if (!newTujuan) {
      toast.error('Name is required');
      return;
    }

    await api.post('/tujuan', { name: newTujuan });
    toast.success('Tujuan Added');
    setNewTujuan('');
    fetchTujuan();
  };

  const handleDeleteTujuan = async (id: string) => {
    await api.delete(`/admin/tujuan/${id}`);
    toast.success('Tujuan Deleted');
    fetchTujuan();
  };

  useEffect(() => {
    fetchTujuan();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Tujuan</h1>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New Tujuan</h2>
        <div className="flex space-x-2">
          <input
            type="text"
            onChange={(e) => setNewTujuan(e.target.value)}
            className="border p-2 rounded"
          />
          <button onClick={handleAddTujuan} className="bg-blue-500 text-white px-4 py-2 rounded">
            Add
          </button>
        </div>
      </div>

      <table className="w-full bg-white shadow rounded">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Nama Tujuan</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tujuan.map((tuju) => (
            <tr key={tuju.id} className="border-b">
              <td className="p-2">{tuju.name}</td>
              <td className="p-2">
                <button
                  onClick={() => handleDeleteTujuan(tuju.id)}
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

export default ManageTujuan;
