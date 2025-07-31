import React, { useState } from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "./css/home-component.css";
// import LoginComponent from "./login-component";
import DashboardOutlineTable from "./elements/dashboard-outline-table";
import DonutChart from "./elements/dashboard-donut-chart";
import BasicBars from "./elements/dashboard-bar-chart";

const HomeComponent = () => {
  const [value, setValue] = useState([new Date(), new Date()]);
  return (
    <main>
      <div className="px-4 py-4 m-2">
        <div className="d-flex align-items-center flex-wrap mb-4">
          <div className="me-auto p-2">
            <h1 className="fw-bold">Dashboard</h1>
          </div>
          <div className="px-3">
            <h5 className="px-1 mt-3">請輸入日期:</h5>
            {/* <div className="custom-date-range-picker"> */}
            <DateRangePicker
              className="mb-2 custom-date-range-picker"
              format="y-MM-dd"
              // rangeColor={["#beff55ff"]}
              onChange={(newValue) => {
                setValue(newValue);
                console.log(newValue);
              }}
              value={value}
            />
            {/* </div> */}
          </div>
        </div>
        <div className="outline-table mb-4">
          <DashboardOutlineTable />
        </div>
        {/* <div className="outline-bar mb-4">
          <BasicBars />
        </div> */}
        <div className="outline-donut">
          <div className="row">
            <div className="col">
              <DonutChart />
            </div>
            <div className="col">
              <DonutChart />
            </div>
            <div className="col">
              <DonutChart />
            </div>
            <div className="col">
              <DonutChart />
            </div>
            {/* <div className="col">
              <DonutChart />
            </div>
            <div className="col">
              <DonutChart />
            </div>
            <div className="col">
              <DonutChart />
            </div> */}
          </div>
        </div>
        <div className="outline-bar mt-4">
          <BasicBars />
        </div>
        <footer className="pt-3 mt-4 text-muted border-top">
          &copy; 2025 Deeyo Tsai
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;
