import "bootstrap/dist/css/bootstrap.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import HomeComponent from "./components/home-component";
import RegisterComponent from "./components/register-component";
import LoginComponent from "./components/login-component";
import ProfileComponent from "./components/profile-component";
import AuthService from "./services/auth.service";
import FmaQueryComponent from "./components/fma-query-component";
import FmaTableComponent from "./components/fma-table-component";
import QueryResultComponent from "./components/query-result-component";

function App() {
  let [currentUser, setCurrentUser] = useState(AuthService.getCurrentUser());
  const defectArr = [
    "r-under",
    "g-under",
    "b-under",
    "bm-wp",
    "r-wp",
    "g-wp",
    "b-wp",
    "r-gel",
    "g-gel",
    "b-gel",
    "r-dev-abnormal",
    "g-dev-abnormal",
    "b-dev-abnormal",
    "r-fiber",
    "g-fiber",
    "b-fiber",
    "bp",
    "bm-dirty",
    "repair",
    "above-p",
    "back-dirty",
    "dirty",
    "oven-drop",
    "black",
  ];
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentUser={currentUser} setCurrentUser={setCurrentUser} />
          }
        >
          <Route index element={<HomeComponent />} />
          <Route path="register" element={<RegisterComponent />} />
          <Route
            path="login"
            element={
              <LoginComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="profile"
            element={
              <ProfileComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="fmaquery"
            element={
              <FmaQueryComponent
              // currentUser={currentUser}
              // setCurrentUser={setCurrentUser}
              />
            }
          />
          <Route
            path="fmatable"
            element={
              <FmaTableComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                defectArr={defectArr}
              />
            }
          />
          <Route
            path="queryResult"
            element={
              <QueryResultComponent
                currentUser={currentUser}
                setCurrentUser={setCurrentUser}
                defectArr={defectArr}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
