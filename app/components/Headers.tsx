import React from 'react';

const Header = () => {
  return (
    <header className="flex justify-between items-center mb-8">
      <h2 className="text-2xl font-extrabold select-none">Sistem Informasi Tata Usaha</h2>
      <div className="flex items-center">
        <div className="relative w-full max-w-[280px]">
          <input type="text" placeholder="Search" className="search-input" aria-label="Search" />
        </div>
        <button aria-label="Notifications" className="bell-icon" type="button" title="Notifikasi">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        <img
          src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/a056376c-0713-4feb-8b8c-2551ee5e35be.png"
          alt="Potret kepala pria berponi dan jenggot sedang tersenyum mengenakan kemeja coklat muda dengan latar belakang polos"
          className="w-[36px] h-[36px] rounded-full ml-4"
          loading="lazy"
        />
      </div>
    </header>
  );
};

export default Header;