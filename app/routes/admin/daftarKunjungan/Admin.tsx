import { useEffect, useState } from 'react'
import AdminLayout from '../root'
import { api } from '~/components/lib/api'

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

export default function TodayVisits() {
  const [visits, setVisits] = useState<Visit[]>([])

  useEffect(() => {
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
    fetchVisits()
  }, [])

  return (
    <AdminLayout>
      <div className="max-w-4xl mx-auto p-6 bg-white">
        <h1 className="text-3xl font-bold mb-6">Today’s Visits</h1>
        {visits.length === 0 ? (
          <p className="text-gray-600">No visits scheduled for today.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">Visitor</th>
                <th className="p-2 text-left">Time</th>
                <th className='p-2 text-left'>Date</th>
                <th className='p-2 text-left'>Status</th>
              </tr>
            </thead>
            <tbody>
              {visits.map(v => (
                <tr key={v.id} className="border-t">
                  <td className="p-2">
                    {v.user.firstName} {v.user.lastName}
                  </td>
                  <td className="p-2">
                    {v.startTime !== "null" ? `${v.startTime} - ${v.endTime}` : `${v.session?.startTime} - ${v.session?.endTime}`}
                  </td>
                  <td className="p-2">
                    {new Date(v.visitDate).toLocaleDateString()}
                  </td>
                  <td className="p-2">
                    {v.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  )
}