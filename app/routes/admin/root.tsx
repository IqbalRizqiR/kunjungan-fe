import type { ReactNode } from "react";
import { Link } from "react-router";
import { useNavigate } from "react-router";


const AdminLayout = ({ children }: { children: ReactNode }) => {
  const menus = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Manage Visits', path: '/admin/visits' },
    { name: 'Manage Sessions', path: '/admin/sessions' },
    { name: 'Visit Settings', path: '/admin/settings' },
    { name: 'Events', path: '/admin/events' },
    { name: 'Institutions', path: '/admin/institutions' },
    { name: 'Packages', path: '/admin/packages' },
    { name: 'Today Visits', path: '/admin/visits/todayVisit' },
    {name: "Tujuan", path: '/admin/tujuan' }
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
  
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setTimeout(() => navigate("/login"), 0);
    } else {
      fetch("/api/me", { headers: { Authorization: `Bearer ${token}` } })
        .then(r => {
          if (!r.ok) throw new Error("unauthorized");
        })
        .catch(() => {
          localStorage.removeItem("authToken");
          navigate("/login");
        });
    }
  }

  return (
    <>
    <div className="flex min-h-screen">
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
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
      </aside>

      <main className="flex-1 bg-gray-100 p-6 overflow-auto">
        {children}
      </main>
    </div>
    </>
  );
};

export default AdminLayout;
