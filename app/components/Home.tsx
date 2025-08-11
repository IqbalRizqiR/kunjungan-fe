import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { api } from "./lib/api";

interface CalendarItem {
  date: Date;
  status: "blocked" | "available" | "full";
}

interface Session {
  id: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface PackageOption {
  value: string;
  name: string;
  price: number;
}

interface Institution {
  id: string;
  name: string;
  isPaid: boolean;
  price: number;
  packages: PackageOption[];
}

interface Tujuan {
  id:string;
  name:string;
}


const BookingPage: React.FC = () => {

  const [calendarData, setCalendarData] = useState<CalendarItem[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [selectedInstitution, setSelectedInstitution] =
    useState<Institution | null>(null);
  const [selectedPackage, setSelectedPackage] = useState<string>("");
  const [tujuan, setTujuan] = useState<Tujuan[]>([]);
  const [tujuanId, setTujuanId] = useState('');

  const [firstName, setUserFirstName] = useState<string>("");
  const [lastName, setUserLastName] = useState<string>("");
  const [phoneNumber, setUserPhoneNumber] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [specialRequest, setSpecialRequest] = useState<string>("");
  const [visitors, setVisitors] = useState<string>("1 person");
  const [totalCost, setTotalCost] = useState<number>(0);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  const generateMonthDays = (year: number, month: number): CalendarItem[] => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => ({
      date: new Date(year, month, i + 1),
      status: "blocked",
    }));
  };

  const handleMonthChange = async (targetDate: Date) => {
    const [eventsRes] = await Promise.all([api.get("/events")]);
    const availabilityRes = await api.get("/visits/availability", {
      params: {
        month: targetDate.getMonth() + 1,
        year: targetDate.getFullYear(),
      },
    });

    const allowedDays = availabilityRes.data;
    const events = eventsRes.data;
    const fullMonth = generateMonthDays(
      targetDate.getFullYear(),
      targetDate.getMonth()
    );

    const result = fullMonth.map((item) => {
      const dateStr = item.date.toISOString().split("T")[0];
      const isEventBlocked = availabilityRes.data.some(
        (e: any) => e.isBookingClosed && e.date.split("T")[0] === dateStr
      );
      const isAllowedDay = allowedDays.includes(item.date.getDay());

      let status: "blocked" | "available" = "blocked";
      if (!isEventBlocked && isAllowedDay) status = "available";

      return { date: item.date, status };
    });

    console.log("Calendar Data:", result);

    setCalendarData(availabilityRes.data);
    setCurrentMonth(targetDate);
  };

  useEffect(() => {
    const fetchData = async () => {
      const [allowedDaysRes, eventsRes, institutionsRes, tujuanRes] = await Promise.all([
        api.get("/visit-settings/allowed-days"),
        api.get("/events"),
        api.get("/institutions"),
        api.get("/tujuan")
      ]);

      setInstitutions(institutionsRes.data);
      setTujuan(tujuanRes.data);
      handleMonthChange(new Date());
    };

    fetchData();
  }, []);
  useEffect(() => {
    if (!selectedDate) return;

    const fetchSessions = async () => {
      const res = await api.get("/visits/sessions", {
        params: { date: selectedDate },
      });
      setSessions(res.data);
    };

    fetchSessions();
  }, [selectedDate]);

  const availableSessions = sessions.filter((s) => !s.isBooked);

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date);
    setSelectedSessionId("");
  };

  const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const instId = e.target.value;
    const inst = institutions.find((i) => i.id === instId) || null;
    setSelectedInstitution(inst);
    setSelectedPackage("");
    setTotalCost(inst?.isPaid ? inst.price : 0);
  };

  const handlePackageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pkgValue = e.target.value;
    setSelectedPackage(pkgValue);
    const pkg = selectedInstitution?.packages.find((p) => p.value === pkgValue);
    setTotalCost(pkg?.price || 0);
  };

  const handleSubmitBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/visits/book", {
        firstName,
        lastName,
        phoneNumber,
        visitors: visitors,
        visitDate: selectedDate,
        email: userEmail,
        tujuanId: tujuanId,
        sessionId: selectedSessionId,
        institutionId: selectedInstitution?.id,
        packageOption: selectedPackage,
        specialRequest,
      });
      setShowConfirmModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const nextMonth = () => {
    const next = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      1
    );
    handleMonthChange(next);
    setCurrentMonth(next);
  };

  const prevMonth = () => {
    const prev = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() - 1,
      1
    );
    handleMonthChange(prev);
    setCurrentMonth(prev);
  };

  return (
    <div className="bg-gray-50">
      <Header />
      {/* ... bagian Hero Section ... */}
      <section className="hero-bg text-white py-16">
        <div className="max-w-10xl mx-auto px-6 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl font-bold mb-4">Selamat Datang Di SMK Telkom Malang</h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Website ini hadir sebagai pusat informasi dan dokumentasi kegiatan kunjungan sekolah, baik kunjungan keluar 
                (study tour, kunjungan industri, museum, kampus, dll) maupun kunjungan tamu ke sekolah.
            </p>
            <div className="flex flex-col sm:flex-row gap-20 justify-center">
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">1000+</div>
                    <div className="text-sm text-blue-100">Siswa Aktif</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">60+</div>
                    <div className="text-sm text-blue-100">Guru</div>
                </div>
                <div className="bg-white bg-opacity-10 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold">32 Th</div>
                    <div className="text-sm text-blue-100">Berdiri Selama</div>
                </div>
            </div>
        </div>
        </section>

      <main className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* ... Bagian Kalender ... */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Pilih Jadwal Visit
              </h3>
              <div className="flex space-x-2">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    />
                  </svg>
                </button>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 text-center">
                    {currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}
                </h4>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-4">
              {[
                "Minggu",
                "Senin",
                "Selasa",
                "Rabu",
                "Kamis",
                "Jumat",
                "Sabtu",
              ].map((day) => (
                <div
                  key={day}
                  className="text-center text-sm font-medium text-gray-500 py-2"
                >
                  {day}
                </div>
              ))}
            </div>
            <div id="calendar" className="grid grid-cols-7 gap-2">
              {calendarData.map((item, idx) => {
                let bg = "bg-gray-200";
                if (item.status === "available") bg = "bg-green-400";
                if (item.status === "full") bg = "bg-yellow-400";
                if (item.status === "blocked") bg = "bg-red-400";

                return (
                  <button
                    key={idx}
                    className={`calendar-day rounded-lg border-2 p-2 text-center 
                                                ${item.status === 'available' ? 'text-gray-300' : ''} 
                                                ${item.status === 'full' ? 'date-fully-booked' : item.status === 'blocked' ? 'date-blocked' : 'date-available'} 
                                                ${item.date === selectedDate ? 'date-selected' : ''}`}
                    disabled={item.status !== "available"}
                    onClick={() => handleSelectDate(new Date(item.date))}
                  >
                    {new Date(item.date).getDate()}
                  </button>
                );
              })}
            </div>
            <div className="mt-6 flex flex-wrap gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded"></div>
                <span>Tersedia</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-red-100 border-2 border-red-500 rounded opacity-60"></div>
                <span>Tidak tersedia</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500 rounded"></div>
                <span>Terpilih</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-100 border-2 border-gray-500 rounded"></div>
                <span>Full</span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Visit Registration
            </h3>

            <form onSubmit={handleSubmitBooking} className="space-y-6">
              <div
                className={`${
                  selectedDate ? "" : "hidden"
                } bg-blue-50 border border-blue-200 rounded-lg p-4`}
              >
                <div className="flex items-center space-x-2">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    />
                  </svg>
                  <span className="text-blue-800 font-medium">
                    Selected Date:
                    <span id="selectedDateText"> {selectedDate?.toLocaleDateString('id-ID')}</span>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Depan *
                  </label>
                  <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setUserFirstName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nama Belakang *
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setUserLastName(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nomor telpon *
                </label>
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setUserPhoneNumber(e.target.value)}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Sesi
                </label>
                {availableSessions.length === 0 ? (
                  <p className="text-red-500">
                    Tidak ada sesi tersedia di tanggal ini.
                  </p>
                ) : (
                  <select
                    value={selectedSessionId}
                    onChange={(e) => setSelectedSessionId(e.target.value)}
                    className="border px-3 py-2 rounded w-full"
                  >
                    <option value="">-- Pilih Sesi --</option>
                    {availableSessions.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.startTime} - {s.endTime}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Visitors
                </label>
                <select
                  name="visitors"
                  value={visitors}
                  onChange={(e) => setVisitors(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option>1 person</option>
                  <option>2 people</option>
                  <option>3 people</option>
                  <option>4 people</option>
                  <option>5+ people</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Asal Instansi
                </label>
                <select
                  value={selectedInstitution?.id || ""}
                  onChange={handleInstitutionChange}
                  className="border rounded p-2 w-full"
                >
                  <option value="">Select Institution</option>
                  {institutions.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.name}
                    </option>
                  ))}
                </select>

                {selectedInstitution?.packages && (
                  <select
                    value={selectedPackage}
                    onChange={handlePackageChange}
                    className="border rounded p-2 w-full"
                  >
                    <option value="">Select Package</option>
                    {selectedInstitution.packages.map((pkg) => (
                      <option key={pkg.value} value={pkg.value}>
                        {pkg.name} (Rp {pkg.price.toLocaleString("id-ID")})
                      </option>
                    ))}
                  </select>
                )}

                {totalCost > 0 && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                    Total Biaya Kunjungan:{" "}
                    <span className="font-bold">
                      Rp {totalCost.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Unit yang dituju
                </label>
                <select
                  value={tujuanId || ""}
                  onChange={(e) => {setTujuanId(e.target.value)}}
                  className="border rounded p-2 w-full"
                >
                  <option value="">Select Tujuan</option>
                  {tujuan.map((tujuan) => (
                    <option key={tujuan.id} value={tujuan.id}>
                      {tujuan.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Spesial request dan pertanyaan
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Any specific areas you'd like to see or questions you have..."
                  onChange={(e) => setSpecialRequest(e.target.value)}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={
                  !selectedSessionId ||
                  !selectedInstitution ||
                  !firstName ||
                  !lastName ||
                  !phoneNumber ||
                  !userEmail
                }
                className={`w-full text-white py-3 px-6 rounded-lg font-medium transition-colors ${
                  selectedDate && availableSessions.length > 0
                    ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {selectedDate
                  ? availableSessions.length > 0
                    ? "Jadwalkan Kunjungan"
                    : "Tidak ada sesi tersedia pada tanggal ini"
                  : "Pilih Tanggal untuk Melanjutkan"}
              </button>
            </form>
          </div>
        </div>

        {/* School Events Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Informasi Event Sekolah
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="border border-red-200 bg-red-50 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm font-medium text-red-800">
                  Tidak ada Visit tersedia
                </span>
              </div>
              <h4 className="font-semibold text-gray-900">
                DiesNatalis Moklet 33
              </h4>
              <p className="text-sm text-gray-600">Agustus 21, 2025</p>
              <p className="text-sm text-gray-500 mt-1">
                Merayakan ulang tahun sekolah ke 33
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {showConfirmModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Booking Successful!</h2>
            <p className="mb-4">Check your email for confirmation details.</p>
            <button
              onClick={() => setShowConfirmModal(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookingPage;
