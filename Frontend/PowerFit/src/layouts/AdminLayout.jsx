import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

function AdminLayout({ children }) {
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-content animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;