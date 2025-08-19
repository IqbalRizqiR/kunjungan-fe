import React from 'react';

const Calendar = () => {
  return (
    <div className="col-span-1 flex flex-col gap-4">
      <section aria-label="Kalender kegiatan pegawai">
        <div className="card flex flex-col p-4 select-none" style={{ minWidth: '140px' }}>
          <p className="font-extrabold mb-0.5">Senin, <span className="font-normal">05 Agustus 2025</span></p>
          <div className="flex mt-3 mb-4 justify-between text-sm font-semibold leading-5 rounded-lg">
            <button type="button" aria-current="false" aria-label="03 Sabtu" className="bg-[#f0f0f0] rounded-lg text-center py-2 px-3 text-[#6b6b6b]">
              <div>03</div><div>Sab</div><div className="text-xs text-[#9b1c1c]">••</div>
            </button>
            <button type="button" aria-current="false" aria-label="04 Minggu" className="bg-[#f0f0f0] rounded-lg text-center py-2 px-3 text-[#6b6b6b]">
              <div>04</div><div>Min</div>
            </button>
            <button type="button" aria-current="true" aria-label="05 Senin" className="bg-[#9b1c1c] rounded-lg text-center py-2 px-3 text-white tab-active-border pointer-events-none">
              <div>05</div><div>Sen</div><div className="text-xs">••</div>
            </button>
            <button type="button" aria-current="false" aria-label="06 Selasa" className="bg-[#f0f0f0] rounded-lg text-center py-2 px-3 text-[#6b6b6b]">
              <div>06</div><div>Sel</div><div className="text-xs text-[#9b1c1c]">•</div>
            </button>
          </div>
          <div className="flex flex-col gap-2 font-semibold text-white">
            <div className="bg-[#9b1c1c] rounded-lg px-3 py-2 cursor-default select-none" tabIndex={0} aria-label="Kunjungan SMPN 4 Kota Malang pukul 09.00">
              Kunjungan SMPN 4 Kota Malang
            </div>
            <div className="h-[3.5rem] border-b border-[#c1c1c1]"></div>
            <div className="h-[3.5rem] border-b border-[#c1c1c1]"></div>
            <div className="bg-[#9b1c1c] rounded-lg px-3 py-2 cursor-default select-none" tabIndex={0} aria-label="Sosialisasi Industri Pt Telkom Id pukul 15.15">
              Sosialisasi Industri Pt Telkom Id
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Calendar;