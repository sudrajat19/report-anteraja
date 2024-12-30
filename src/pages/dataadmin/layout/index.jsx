import Navbar from "../../../components/navbar/navbar";
import Sidebar from "../../../components/sidebar.jsx";
/* eslint-disable */

const Layout = ({ children }) => {
  /* eslint-enable */
  return (
    <div className="h-screen">
      <Navbar />
      <div className="flex pt-[50px]">
        <Sidebar />
        <div className="w-full p-4">{children}</div>
      </div>
    </div>
  );
};
export default Layout;
