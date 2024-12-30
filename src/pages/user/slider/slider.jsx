import Navbar from "../../../components/navbar/navbar";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
// import axios from "axios";

const sliderData = [
  {
    id: 1,
    image: "/images/buanges1.jpeg",
    title: "(AM)",
    name: "Ibu Angesty",
    desc: "Menjadi solusi terdepan dalam bidang logistik untuk mempermudah hidup masyarakat Indonesia.",
    role: "Area Manager",
  },
  {
    id: 2,
    image: "/images/pakAyut.jpeg",
    title: "(SSL)",
    name: "Pak Ayut",
    desc: "Mendorong pertumbuhan ekonomi negara Indonesia.",
    role: "Staging Store Leader",
  },
];

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const timer = setInterval(() => handleNext(), 10000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? sliderData.length - 1 : prevIndex - 1
    );
  };

  return (
    <>
      <Navbar />
      <div
        className="relative w-full pt-[100px] h-[100vh] text-white overflow-hidden"
        style={{
          backgroundImage: `url(${sliderData[currentIndex].image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Teks Tengah */}
        <div className="absolute top-[50%] right-[10%] max-w-[40%]">
          <h2 className="text-6xl font-bold text-white">
            {sliderData[currentIndex].title} {sliderData[currentIndex].name}
          </h2>
          <p className="mt-4 text-lg leading-relaxed">
            {sliderData[currentIndex].desc}
          </p>
        </div>

        {/* Gambar Kecil */}
        <div className="absolute bottom-10 left-[10%] flex space-x-4">
          {sliderData.map((item, index) => (
            <div
              key={item.id}
              className={`cursor-pointer rounded-lg overflow-hidden shadow-md ${
                currentIndex === index ? "ring-4 ring-pink-500" : ""
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 object-cover"
              />
              <div className="bg-gray-800 p-2 text-center">
                <h3 className="font-bold">{item.name}</h3>
                <p className="text-xs">{item.role}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tombol Navigasi */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-pink-600 p-4 text-white rounded-full"
        >
          &lt;
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-pink-600 p-4 text-white rounded-full"
        >
          &gt;
        </button>
      </div>
    </>
  );
};

export default Slider;
