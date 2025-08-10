import { useEffect, useState } from "react";
import { toast } from "sonner";
import { api } from "~/components/lib/api";
import AdminLayout from "../root";

const weekdays = [
  { name: 'Minggu', value: 0 },
  { name: 'Senin', value: 1 },
  { name: 'Selasa', value: 2 },
  { name: 'Rabu', value: 3 },
  { name: 'Kamis', value: 4 },
  { name: 'Jumat', value: 5 },
  { name: 'Sabtu', value: 6 },
];

const ManageSettings = () => {
  const [allowedDays, setAllowedDays] = useState<number>();
  const [allowedDay, setAllowedDay] = useState<number | null>(null);

  const fetchSettings = async () => {
    const res = await api.get('/visit-settings');
    setAllowedDays(res.data[0].allowedWeekday || []);
    console.log(res.data[0].allowedWeekday);
  };
  

  const handleSave = async () => {
    console.log(allowedDay);
    if (allowedDay === null) {
      toast.error('Please select a day');
      return;
    }
    await api.post('/visit-settings', { allowedWeekday: allowedDay });
    console.log("updatedd");
    toast.success('Settings Updated');
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-4">Visit Settings</h1>
      <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <select className="border p-2 rounded w-full" onChange={(e) => setAllowedDay(Number(e.target.value))}>
              <option value="">---- Pilih Hari diizinkan ----</option>
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
          </div>
      </div>
      <button
        onClick={handleSave}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Settings
      </button>
    </AdminLayout>
  );
};

export default ManageSettings;