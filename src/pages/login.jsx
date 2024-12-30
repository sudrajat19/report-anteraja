import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState({ nik: "", password: "" });
  const [msg, setMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword(!showPassword);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    try {
      if (token) {
        jwtDecode(token);
        navigate("/home");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("accessToken");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLogin({ ...login, [name]: value });
  };

  const Auth = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3020/login", login);
      if (response.data.success) {
        const { accessToken, refreshToken } = response.data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        const decode = jwtDecode(accessToken);
        const resLogin = await axios.get(
          `http://localhost:3020/tampil/${decode.id}`
        );
        if (resLogin.data) {
          const checkAdmin = resLogin.data.role;
          console.log("role", checkAdmin);
          navigate(checkAdmin === "admin" ? "/admin" : "/home");
        }
      } else {
        setMsg(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.message || "nik atau Password salah");
      } else if (error.request) {
        setMsg("Server tidak merespons. Coba lagi nanti.");
      } else {
        setMsg("Terjadi kesalahan. Silakan coba lagi.");
      }
    }
  };

  return (
    <div className="min-h-screen">
      <form
        onSubmit={Auth}
        className="w-full max-w-[296px] md:max-w-[418px] lg:max-w-[398px] bg-white shadow rounded p-8 mx-auto mt-[200px]"
      >
        <p className="text-center font-bold text-red-500 my-1">{msg}</p>
        <h1 className="text-center text-2xl text-pink-500 font-bold">Login</h1>
        <label htmlFor="nik" className="font-semibold">
          NIK
        </label>
        <input
          type="text"
          id="nik"
          name="nik"
          onChange={handleChange}
          className="input-border"
          placeholder="Masukkan NIK"
          value={login.nik}
          required
        />
        <label htmlFor="password" className="font-semibold">
          Password
        </label>
        <div className="input-border flex">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            onChange={handleChange}
            className="outline-none border-none w-full"
            placeholder="*********"
            value={login.password}
            required
          />
          <img
            src="/images/mata.png"
            onClick={toggleShowPassword}
            className="w-4 h-4 self-center m-2 cursor-pointer hover:opacity-70"
            alt={showPassword ? "Hide password" : "Show password"}
          />
        </div>
        <button
          type="submit"
          className="btn-blue bg-pink-500 text-white px-4 py-2 rounded my-8"
        >
          Masuk
        </button>
      </form>
    </div>
  );
}
