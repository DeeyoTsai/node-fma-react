import { Outlet } from "react-router-dom";
import Nav from "./nav-component";

const Layout = ({
  currentUser,
  setCurrentUser,
  othersColSpan,
  setOthersColSpan,
  defectArr,
  setDefectArr,
}) => {
  return (
    <div>
      <Nav
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        othersColSpan={othersColSpan}
        setOthersColSpan={setOthersColSpan}
        defectArr={defectArr}
        setDefectArr={setDefectArr}
      />
      <Outlet />
    </div>
  );
};

export default Layout;
