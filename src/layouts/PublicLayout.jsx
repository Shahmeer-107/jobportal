import { Outlet } from "react-router-dom";
import Navbar from "../Components/common/Navbar";

function PublicLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

export default PublicLayout;