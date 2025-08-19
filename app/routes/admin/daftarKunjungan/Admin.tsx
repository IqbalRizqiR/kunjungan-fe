import { useEffect, useMemo, useState } from 'react'
import AdminLayout from '../root'
import { api } from '~/components/lib/api'


import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import { toast } from 'sonner'

interface Visit {
    id: string;
    date: string;
    sessionId: string;
    institutionId: string;
    packageOption: string;
    package?: {
        name: string;
        description: string;
        price: number;
    };
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

export default function TodayVisits() {
  const [visits, setVisits] = useState<Visit[]>([])
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null)
  const [loading, setLoading] = useState(false)
  const fetchVisits = async () => {
    try {
      const res = await api.get<Visit[]>('/visits/admin/list')
      const allVisits = res.data
      const todayKey = new Date().toISOString().split('T')[0]
      const approved = allVisits.filter(v =>
        v.status === 'APPROVED'
      )
      setVisits(approved)
    } catch (err) {
      console.error('Error fetching visits:', err)
    }
  }

  useEffect(() => {
    
    fetchVisits()
  }, [])

  const events = useMemo(() => 
    visits.map(v => ({
      id: v.id,
      title: `${v.user.firstName + ' ' + v.user.lastName} | ${v.institution?.name} ${v.packageOption ? v.packageOption : ''}`,
      start: v.visitDate,
      color:
        v.status === 'PENDING'  ? '#facc15' :
        v.status === 'APPROVED' ? '#22c55e' :
                                  '#ef4444',
      extendedProps: { visit: v }
    })),
  [visits])

  return (
    <AdminLayout>
      <div className="w-full mx-auto p-6 bg-white">
        <h1 className="text-3xl text-center font-bold mb-12 ">Agenda Kunjungan</h1>
        {visits.length === 0 ? (
          <p className="text-gray-600">No visits scheduled for today.</p>
        ) : (
          <FullCalendar
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView="dayGridMonth"
            locale="id"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,dayGridWeek,dayGridDay',
            }}
            events={events}
            eventClick={info => {
              const v = (info.event.extendedProps as any).visit as Visit
              setSelectedVisit(v)
            }}
            height="auto"
            dayMaxEventRows={3}
            eventDisplay="block"
            eventClassNames="rounded-md shadow-sm"
          />
        )}
      </div>
      {selectedVisit && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="text-xl font-semibold mb-2">
              {selectedVisit.user.firstName} {selectedVisit.user.lastName}
            </h2>
            <h2 className="text-xl font-semibold mb-2">
              Institution : {selectedVisit.institution?.name}
            </h2>
            {selectedVisit.packageOption ? <h2 className="text-xl font-semibold mb-2">
              Package Name : {selectedVisit.packageOption}
            </h2> : null}
            <p className="text-sm text-gray-600 mb-2">
              {new Date(selectedVisit.visitDate).toLocaleDateString('id-ID', {
                weekday: 'long', day: '2-digit', month: 'long', year: 'numeric'
              })}
            </p>
            <p className="mb-4">
              <strong>Time:</strong>{' '}
              {selectedVisit.startTime !== 'null'
                ? `${selectedVisit.startTime} - ${selectedVisit.endTime}`
                : `${selectedVisit.session?.startTime} - ${selectedVisit.session?.endTime}`}
            </p>
            <p className="mb-4">
              <strong>Status:</strong>{' '}
              <span className={`font-semibold ${
                selectedVisit.status === 'PENDING'  ? 'text-yellow-500' :
                selectedVisit.status === 'APPROVED' ? 'text-green-600' :
                                                      'text-red-600'
              }`}>
                {selectedVisit.status}
              </span>
            </p>
            <div className="flex justify-end space-x-2">
              {selectedVisit.status === 'PENDING' && (
                <>
                </>
              )}
              <button
                onClick={() => setSelectedVisit(null)}
                className="bg-gray-200 text-gray-800 px-4 py-1 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}