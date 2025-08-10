import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { api } from '~/components/lib/api';
import AdminLayout from '../root';

interface Visit {
    id: string;
    date: string;
    sessionId: string;
    institutionId: string;
    packageOption: string;
    specialRequest: string;
    visitors: string;
    status: string;
    user: {
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
    };
    startTime: string;
    endTime: string;
    visitDate: string;
    session?: {
        startTime: string;
        endTime: string;
    };
    institution?: {
        name: string;
    };
}

const ManageVisits = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVisits = async () => {
    setLoading(true);
    const res = await api.get('/visits/admin/list');
    setVisits(res.data);
    setLoading(false);
  };

  const handleApprove = async (id: string) => {
    await api.post(`/visits/${id}/approve`);
    toast.success('Visit Approved');
    fetchVisits();
  };

  const handleReject = async (id: string) => {
    await api.post(`/visits/${id}/reject`);
    toast.success('Visit Rejected');
    fetchVisits();
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Manage Visits</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="w-full bg-white shadow rounded">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Institution</th>
              <th className="p-2">Date</th>
              <th className="p-2">Session</th>
              <th className="p-2">Status</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {visits.length > 0 ? (
                visits.map((visit) => (
              <tr key={visit.id} className="border-b">
                <td className="p-2">{visit.user.firstName} {visit.user.lastName}</td>
                <td className="p-2">{visit.user.email}</td>
                <td className="p-2">{visit.institution?.name}</td>
                <td className="p-2">{new Date(visit.visitDate).toLocaleDateString()}</td>
                <td className="p-2">{visit.session?.startTime} - {visit.session?.endTime}</td>
                <td className="p-2">{visit.status}</td>
                <td className="p-2 space-x-2">
                  {visit.status === 'PENDING' && (
                    <>
                      <button onClick={() => handleApprove(visit.id)} className="bg-green-500 text-white px-2 py-1 rounded">Approve</button>
                      <button onClick={() => handleReject(visit.id)} className="bg-red-500 text-white px-2 py-1 rounded">Reject</button>
                    </>
                  )}
                </td>
              </tr>
            ))
            ) : (
                <tr>
                    <td colSpan={7} className="p-4 text-center">No visits found</td>
                </tr>
            )}
          </tbody>
        </table>
      )}
    </AdminLayout>
  );
};

export default ManageVisits;
