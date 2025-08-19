import React from 'react';

const StatsCards = () => {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
      <div className="card flex flex-col items-center text-center p-6">
        <span className="text-light text-sm mb-2 select-none">Total Pegawai</span>
        <span className="text-2xl font-bold select-none">100</span>
        <span className="font-bold select-none">Pegawai</span>
      </div>
      <div className="card flex flex-col justify-center p-6 text-center">
        <span className="text-light text-sm mb-2 select-none">Disitribusi Jabatan</span>
        <span className="font-semibold text-base md:text-lg select-none">Guru, Teknisi, Tu, Dll</span>
      </div>
      <div className="card flex justify-around p-6 select-none">
        <div className="text-center">
          <span className="text-light text-sm block mb-1">Status Kepegawaian</span>
          <div className="flex justify-between font-black text-sm md:text-base">
            <div  className='ml-4 flex-col items-center'>
              <div className="text-[#9b1c1c] font-bold">Aktif</div>
              <div>92</div>
            </div>
            <div className='ml-4 flex-col items-center'>
              <div className="text-[#9b1c1c] font-bold">Cuti</div>
              <div>4</div>
            </div>
            <div className='ml-4 flex-col items-center'>
              <div className="text-[#9b1c1c] font-bold">Pensiun</div>
              <div>2</div>
            </div>
          </div>
        </div>
      </div>
      <div className="card flex items-center justify-center p-6 select-none">
        <span className="text-light font-semibold">Notifikasi Penting</span>
      </div>
    </section>
  );
};

export default StatsCards;