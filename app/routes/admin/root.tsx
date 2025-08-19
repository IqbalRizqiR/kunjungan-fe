import { useEffect, type ReactNode } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";
import '../../app.css'


const AdminLayout = ({ children }: { children: ReactNode }) => {
  const menus = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Manage Visits', path: '/admin/visits' },
    { name: 'Visit Settings', path: '/admin/settings' },
    { name: 'Manage Events', path: '/admin/events' },
    { name: 'All Visits', path: '/admin/visits/todayVisit' },
    { name: 'Attendance Management', path: '/admin/attendance' },
    { name: 'Talent Management', path: '/admin/talent' },
    { name: 'Recruitment', path: '/admin/recruitment' },
    { name: 'Training', path: '/admin/training' },
    { name: 'Performance', path: '/admin/performance' },
    { name: 'Engagement', path: '/admin/engagement' },
    { name: 'AI & Analytics', path: '/admin/analytics' },
  ];
  const navigate = useNavigate();

  const handleLogout = async () => {
    // call your logout endpoint if needed
    await fetch("/api/logout", { method: "POST" });
    // clear stored auth data
    localStorage.removeItem("authToken");
    // redirect to login page
    navigate("/login");
  };
  

  return (
    <>
    <div className="flex min-h-screen font-inter bg-[#fff6f6] text-[#9b1c1c]">
      <aside className="sidebar flex flex-col bg-[#9b1c1c] w-52 p-6 text-white justify-between">
        <div>
          <h1 className="font-extrabold text-4xl tracking-tight pb-10 select-none">SITU</h1>
          <nav className="space-y-4 font-semibold text-lg">
            {menus.map((menu) => (
              <a key={menu.name} href={menu.path} className="block hover:bg-[#7f1d1d] rounded-md px-4 py-2 select-none">{menu.name}</a>
            ))}
            <button
            onClick={handleLogout}
            className="mx-auto block mt-20 cursor-pointer items-center px-4 py-2 rounded text-center bg-red-500 w-[60%] hover:bg-gray-700"
          >
            Logout
          </button>
          </nav>
        </div>
      </aside>
      {/* <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-bold">Admin Panel</h2>
        <nav className="space-y-2">
          {menus.map((menu) => (
            <Link key={menu.path} to={menu.path}>
              <span className={`block px-4 py-2 rounded hover:bg-gray-700`}>{menu.name}</span>
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="mx-auto block mt-20 cursor-pointer items-center px-4 py-2 rounded text-center bg-red-500 w-[60%] hover:bg-gray-700"
          >
            Logout
          </button>
        </nav>
      </aside> */}

      <main className="flex-1 bg-gray-100 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
    </>
  );
};

export default AdminLayout;
