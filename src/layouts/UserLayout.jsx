import UserNavbar from "../components/UserNavbar";
import { Outlet } from "react-router-dom";

const UserLayout = () => {
  return (
    <>
      <UserNavbar />
      <Outlet />
    </>
  );
};

export default UserLayout;
