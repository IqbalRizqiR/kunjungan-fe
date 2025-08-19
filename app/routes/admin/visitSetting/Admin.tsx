// import { useEffect, useState } from "react";
// import { toast } from "sonner";
// import { api } from "~/components/lib/api";
// import AdminLayout from "../root";

// const weekdays = [
//   { name: 'Minggu', value: 0 },
//   { name: 'Senin', value: 1 },
//   { name: 'Selasa', value: 2 },
//   { name: 'Rabu', value: 3 },
//   { name: 'Kamis', value: 4 },
//   { name: 'Jumat', value: 5 },
//   { name: 'Sabtu', value: 6 },
// ];

// const ManageSettings = () => {
//   const [allowedDays, setAllowedDays] = useState<number>();
//   const [allowedDay, setAllowedDay] = useState<number | null>(null);

//   const fetchSettings = async () => {
//     const res = await api.get('/visit-settings');
//     setAllowedDays(res.data[0].allowedWeekday || []);
//     console.log(res.data[0].allowedWeekday);
//   };
  

//   const handleSave = async () => {
//     console.log(allowedDay);
//     if (allowedDay === null) {
//       toast.error('Please select a day');
//       return;
//     }
//     await api.post('/visit-settings', { allowedWeekday: allowedDay });
//     console.log("updatedd");
//     toast.success('Settings Updated');
//   };

//   useEffect(() => {
//     fetchSettings();
//   }, []);

//   return (
//     <AdminLayout>
//       <h1 className="text-2xl font-bold mb-4">Visit Settings</h1>
//       <div className="space-y-2">
//           <div className="flex items-center space-x-2">
//             <select className="border p-2 rounded w-full" onChange={(e) => setAllowedDay(Number(e.target.value))}>
//               <option value="">---- Pilih Hari diizinkan ----</option>
//             {weekdays.map(day =>
//                 <option
//                     key={day.value}
//                     value={day.value}
//                     selected={allowedDays === day.value}
//                 >
//                     {day.name}
//                 </option>
//             )}
//             </select>
//           </div>
//       </div>
//       <button
//         onClick={handleSave}
//         className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
//       >
//         Save Settings
//       </button>
//     </AdminLayout>
//   );
// };

// export default ManageSettings;

import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { api } from '~/components/lib/api'
import AdminLayout from '../root'

interface Weekday { name: string; value: number }
interface Institution { id: string; name: string; isPaid: boolean; price: number; }
interface PackageOption { id: string; name: string; value: string; price: number; institution?: { id: string; name: string } }
interface Session { id: string; startTime: string; endTime: string }
interface Tujuan { id: string; name: string }

const weekdays: Weekday[] = [
  { name: 'Minggu', value: 0 },{ name: 'Senin', value: 1 },{ name: 'Selasa', value: 2 },
  { name: 'Rabu', value: 3 },{ name: 'Kamis', value: 4 },{ name: 'Jumat', value: 5 },
  { name: 'Sabtu', value: 6 },
]

export default function VisitSettingsPage() {
  // visit-settings
  const [allowedDays, setAllowedDays] = useState<number>(0)
  const [chosenDay, setChosenDay] = useState<number|''>('')

  // institutions
  const [institutions, setInstitutions] = useState<Institution[]>([])
  const [instName, setInstName] = useState('')
  const [instPaid, setInstPaid] = useState(false)
  const [instPrice, setInstPrice] = useState(0)

  // sessions
  const [sessions, setSessions] = useState<Session[]>([])
  const [sessStart, setSessStart] = useState('')
  const [sessEnd, setSessEnd] = useState('')

  // packages
  const [packages, setPackages] = useState<PackageOption[]>([])
  const [pkgName, setPkgName] = useState('')
  const [pkgValue, setPkgValue] = useState('')
  const [pkgPrice, setPkgPrice] = useState(0)
  const [pkgInstId, setPkgInstId] = useState('')
  const [editingPkg, setEditingPkg] = useState<PackageOption|null>(null)
  const [showPkgModal, setShowPkgModal] = useState(false)

  // tujuan
  const [tujuanList, setTujuanList] = useState<Tujuan[]>([])
  const [newTujuan, setNewTujuan] = useState('')

  // fetch all data
  useEffect(() => {
    ;(async () => {
      try {
        const [vsRes, instRes, sessRes, pkgRes, tjRes] = await Promise.all([
          api.get('/visit-settings'),
          api.get('/institutions'),
          api.get('/sessions'),
          api.get('/institutions/packages'),
          api.get('/tujuan')
        ])
        setAllowedDays(vsRes.data[0].allowedWeekday)
        setInstitutions(instRes.data)
        setSessions(sessRes.data)
        setPackages(pkgRes.data)
        setTujuanList(tjRes.data)
      } catch {
        toast.error('Gagal memuat data')
      }
    })()
  }, [])


  // Visit Settings
  const saveSettings = async () => {
    if (chosenDay === '') return toast.error('Pilih hari terlebih dulu')
    await api.post('/visit-settings', { allowedWeekday: chosenDay })
    setAllowedDays(chosenDay)
    toast.success('Pengaturan tersimpan')
  }

  // Institutions handlers
  const addInstitution = async () => {
    if (!instName) return toast.error('Nama institusi wajib')
    await api.post('/institutions', {
      name: instName, isPaid: instPaid, price: instPaid ? instPrice : 0
    })
    setInstName(''); setInstPaid(false); setInstPrice(0)
    setInstitutions((await api.get('/institutions')).data)
    toast.success('Institusi ditambahkan')
  }
  const deleteInstitution = async (id: string) => {
    if (!confirm('Hapus institusi?')) return
    await api.delete(`/institutions/${id}`)
    setInstitutions(institutions.filter(i=>i.id !== id))
    toast.success('Institusi dihapus')
  }

  // Sessions handlers
  const addSession = async () => {
    if (!sessStart || !sessEnd) return toast.error('Waktu wajib diisi')
    await api.post('/sessions', { startTime: sessStart, endTime: sessEnd })
    setSessStart(''); setSessEnd('')
    setSessions((await api.get('/sessions')).data)
    toast.success('Sesi ditambahkan')
  }
  const deleteSession = async (id: string) => {
    await api.delete(`sessions/${id}`)
    setSessions(sessions.filter(s=>s.id!==id))
    toast.success('Sesi dihapus')
  }

  // Packages handlers
  const openEditPkg = (p: PackageOption) => {
    setEditingPkg(p)
    setPkgName(p.name); setPkgValue(p.value); setPkgPrice(p.price)
    setPkgInstId(p.institution?.id||'')
    setShowPkgModal(true)
  }
  const addOrUpdatePkg = async () => {
    if (!pkgName||!pkgValue||!pkgInstId) return toast.error('Lengkapi data paket')
    if (editingPkg) {
      await api.patch(`/packages/${editingPkg.id}`, {
        name: pkgName, value: pkgValue, price: pkgPrice, institutionId: pkgInstId
      })
    } else {
      await api.post(`/institutions/${pkgInstId}/packages`, {
        name: pkgName, value: pkgValue, price: pkgPrice
      })
    }
    setPackages((await api.get('/institutions/packages')).data)
    setEditingPkg(null); setShowPkgModal(false)
    setPkgName(''); setPkgValue(''); setPkgPrice(0); setPkgInstId('')
    toast.success(`Paket ${editingPkg?'diubah':'ditambah'}`)
  }
  const deletePackage = async (id: string) => {
    if (!confirm('Hapus paket?')) return
    await api.delete(`/packages/${id}`)
    setPackages(packages.filter(p=>p.id!==id))
    toast.success('Paket dihapus')
  }

  // Tujuan handlers
  const addTujuan = async () => {
    if (!newTujuan) return toast.error('Nama tujuan wajib')
    await api.post('/tujuan', { name: newTujuan })
    setTujuanList((await api.get('/tujuan')).data)
    setNewTujuan(''); toast.success('Tujuan ditambah')
  }
  const deleteTujuan = async (id: string) => {
    await api.delete(`tujuan/${id}`)
    setTujuanList(tujuanList.filter(t=>t.id!==id))
    toast.success('Tujuan dihapus')
  }

  return (
    <AdminLayout>
      <h1 className="text-3xl font-bold mb-6">Visit Settings & Admin Tools</h1>

      {/* Visit Settings */}
      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-2">Pengaturan Hari Kunjungan</h2>
        <div className="flex items-center space-x-2">
          <select
            onChange={e=>setChosenDay(Number(e.target.value))}
            className="border p-2 rounded"
          >
            <option value="">— Pilih Hari —</option>
            {weekdays.map(day =>
               <option
                   key={day.value}
                   value={day.value}
                   selected={allowedDays === day.value}
               >
                   {day.name}
               </option>
           )}
          </select>
          <button
            onClick={saveSettings}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Simpan
          </button>
        </div>
      </section>

      {/* Institutions */}
      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-2">Manage Institutions</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <input
            type="text" placeholder="Nama Institusi"
            value={instName} onChange={e=>setInstName(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <label className="flex items-center space-x-1">
            <input
              type="checkbox" checked={instPaid}
              onChange={e=>setInstPaid(e.target.checked)}
            />
            <span>Berbayar</span>
          </label>
          {instPaid && (
            <input
              type="number" placeholder="Harga"
              value={instPrice} min={0}
              onChange={e=>setInstPrice(Number(e.target.value))}
              className="border p-2 rounded w-32"
            />
          )}
          <button
            onClick={addInstitution}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Tambah
          </button>
        </div>
        <ul className="space-y-2">
          {institutions.map(i => (
            <li key={i.id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <strong>{i.name}</strong> &ndash; {i.isPaid ? `Rp ${i.price.toLocaleString()}` : 'Gratis'}
              </div>
              <button
                onClick={()=>deleteInstitution(i.id)}
                className="bg-red-500 px-2 py-1 rounded text-white"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Sessions */}
      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-2">Manage Sessions</h2>
        <div className="flex items-center gap-2 mb-4">
          <input
            type="time" value={sessStart}
            onChange={e=>setSessStart(e.target.value)}
            className="border p-2 rounded"
          />
          <input
            type="time" value={sessEnd}
            onChange={e=>setSessEnd(e.target.value)}
            className="border p-2 rounded"
          />
          <button
            onClick={addSession}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Tambah
          </button>
        </div>
        <ul className="space-y-2">
          {sessions.map(s => (
            <li key={s.id} className="flex justify-between p-2 border rounded">
              <span>{s.startTime} – {s.endTime}</span>
              <button
                onClick={()=>deleteSession(s.id)}
                className="bg-red-500 px-2 py-1 rounded text-white"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </section>

      {/* Packages */}
      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-2">Manage Packages</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          <select
            value={pkgInstId}
            onChange={e=>setPkgInstId(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">Pilih Institusi</option>
            {institutions.map(i=>(
              <option key={i.id} value={i.id}>{i.name}</option>
            ))}
          </select>
          <input
            type="text" placeholder="Nama Paket"
            value={pkgName} onChange={e=>setPkgName(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <input
            type="text" placeholder="Kode Paket"
            value={pkgValue} onChange={e=>setPkgValue(e.target.value)}
            className="border p-2 rounded w-32"
          />
          <input
            type="number" placeholder="Harga"
            value={pkgPrice} min={0}
            onChange={e=>setPkgPrice(Number(e.target.value))}
            className="border p-2 rounded w-32"
          />
          <button
            onClick={addOrUpdatePkg}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            {editingPkg ? 'Update' : 'Tambah'}
          </button>
        </div>
        <ul className="space-y-2">
          {packages.map(p=>(
            <li key={p.id} className="flex justify-between items-center p-2 border rounded">
              <div>
                <strong>{p.name}</strong> ({p.value}) &ndash; Rp {p.price.toLocaleString('id-ID')}
                <br/><small className="text-gray-600">{p.institution?.name}</small>
              </div>
              <div className="space-x-2">
                <button
                  onClick={()=>openEditPkg(p)}
                  className="bg-yellow-500 px-2 py-1 rounded text-white"
                >
                  Edit
                </button>
                <button
                  onClick={()=>deletePackage(p.id)}
                  className="bg-red-500 px-2 py-1 rounded text-white"
                >
                  Hapus
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Tujuan */}
      <section className="bg-white p-4 rounded-lg shadow mb-6">
        <h2 className="font-semibold mb-2">Manage Tujuan</h2>
        <div className="flex gap-2 mb-4">
          <input
            type="text" placeholder="Nama Tujuan"
            value={newTujuan} onChange={e=>setNewTujuan(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={addTujuan}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Tambah
          </button>
        </div>
        <ul className="space-y-2">
          {tujuanList.map(t=>(
            <li key={t.id} className="flex justify-between p-2 border rounded">
              <span>{t.name}</span>
              <button
                onClick={()=>deleteTujuan(t.id)}
                className="bg-red-500 px-2 py-1 rounded text-white"
              >
                Hapus
              </button>
            </li>
          ))}
        </ul>
      </section>
    </AdminLayout>
  )
}