import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { api } from '~/components/lib/api';
import AdminLayout from '../root';
import StatsCards from '~/components/Charts';
import Headers from '~/components/Headers';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

interface Visit {
  id: string;
  visitDate: string; // ISO
  status: string;
  session?: { startTime: string; endTime: string };
  institution?: { name: string };
  user: { firstName: string; lastName: string };
}

const ManageVisits = () => {
  const [visits, setVisits] = useState<Visit[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);

  const redirectToLogin = () => (window.location.href = '/login');

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const res = await api.get<Visit[]>('/visits/admin/list');
      setVisits(res.data);
    } catch (err: any) {
      if (err.response?.status === 401) redirectToLogin();
      else toast.error('Failed to fetch visits');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await api.patch(`/visits/${id}/approve`);
      toast.success('Visit Approved');
      fetchVisits();
      setSelectedVisit(null);
    } catch (err: any) {
      toast.error('Failed to approve visit');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await api.patch(`/visits/${id}/reject`);
      toast.success('Visit Rejected');
      fetchVisits();
      setSelectedVisit(null);
    } catch (err: any) {
      toast.error('Failed to reject visit');
    }
  };

  

  const events = useMemo(
  () =>
    visits.map(v => ({
      id: v.id,
      title: v.institution?.name || 'Visit',
      start: v.visitDate,
      color:
        v.status === 'PENDING'
          ? '#facc15'
          : v.status === 'APPROVED'
          ? '#22c55e'
          : '#ef4444',
    })),
  [visits]
);

  return (
    <AdminLayout>
      <Headers />
      <StatsCards />

      <section className="mb-8 p-4">
        <h2 className="font-bold text-lg mb-3">Agenda Kunjungan</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            locale="id"
            events={events}
            eventClick={(info) => {
              const visit = visits.find(v => v.id === info.event.id);
              if (visit) setSelectedVisit(visit);
            }}
            height="auto"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay',
            }}
            dayMaxEventRows={3}
            eventDisplay="block"
            eventClassNames="rounded-md shadow-sm"
          />
        )}
      </section>

      {/* Modal detail kunjungan */}
      {selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-[400px]">
            <h3 className="text-lg font-bold mb-3">
              {selectedVisit.institution?.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">
              {new Date(selectedVisit.visitDate).toLocaleDateString('id-ID', {
                weekday: 'long',
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </p>
            {selectedVisit.session && (
              <p className="text-sm mb-2">
                {selectedVisit.session.startTime} – {selectedVisit.session.endTime}
              </p>
            )}
            <p className="text-sm mb-4">
              Status:{' '}
              <span
                className={`font-bold ${
                  selectedVisit.status === 'PENDING'
                    ? 'text-yellow-500'
                    : selectedVisit.status === 'APPROVED'
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}
              >
                {selectedVisit.status}
              </span>
            </p>

            <div className="flex justify-end gap-2">
              {selectedVisit.status === 'PENDING' && (
                <>
                  <button
                    onClick={() => handleApprove(selectedVisit.id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(selectedVisit.id)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Reject
                  </button>
                </>
              )}
              <button
                onClick={() => setSelectedVisit(null)}
                className="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageVisits;
