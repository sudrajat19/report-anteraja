import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/");
  };

  const handleToggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="fixed w-full h-[60px]  bg-white text-black shadow z-50">
      <div className="flex justify-between items-center px-6 md:px-10 lg:px-20 py-4">
        <img
          className="w-[80px] active:translate-y-1"
          src="/images/iconAj.png"
          alt="Logo"
          onError={(e) => {
            e.target.src = "/images/defaultLogo.png"; // Fallback jika gambar gagal dimuat
          }}
        />

        <ul className="hidden lg:flex items-center gap-8">
          <Navigasi />
          <li onClick={handleLogout} className="cursor-pointer font-bold hover:text-secondary-500">
            Logout
          </li>
        </ul>

        <div className="lg:hidden">
          <button onClick={handleToggleMenu} className="flex flex-col space-y-1.5 hamburger-menu">
            <div className={`h-0.5 w-6 bg-black transition-transform ${isMenuOpen ? "rotate-45 translate-y-2.5" : ""}`}></div>
            <div className={`h-0.5 w-6 bg-black transition-opacity ${isMenuOpen ? "opacity-0" : "opacity-100"}`}></div>
            <div className={`h-0.5 w-6 bg-black transition-transform ${isMenuOpen ? "-rotate-45 -translate-y-3" : ""}`}></div>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="lg:hidden bg-white shadow-md  absolute top-[60px] left-0 w-full z-40">
          <ul className="flex flex-col items-center gap-6 py-4">
            <Navigasi />
            <li onClick={handleLogout} className="cursor-pointer font-bold text-black hover:text-secondary-500">
              Logout
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}

function Navigasi() {
  const links = [
    { to: "/home", text: "Home" },
    { to: "/report", text: "Report" },
    { to: "/profile", text: "Profile" },
    { to: "/admin", text: "Admin" },
    { to: "/satria", text: "Satria" },
  ];

  return (
    <>
      {links.map((link, index) => (
        <li key={index} className="cursor-pointer font-bold text-black hover:text-secondary-500">
          <Link to={link.to}>{link.text}</Link>
        </li>
      ))}
    </>
  );
}
