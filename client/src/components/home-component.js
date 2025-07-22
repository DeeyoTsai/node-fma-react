import React, { useState } from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
const HomeComponent = () => {
  const [value, setValue] = useState([new Date(), new Date()]);
  return (
    <main>
      <div className="px-4 py-4 m-2">
        <div className="d-flex align-items-center justify-content-between">
          <div className="">
            <h1 className="fw-bold">Dashboard</h1>
          </div>
          <div className="">
            <h5 className=" mt-3">請輸入日期:</h5>
            <DateRangePicker
              className="mb-2"
              onChange={(newValue) => setValue(newValue)}
              value={value}
            />
          </div>
        </div>

        <footer className="pt-3 mt-4 text-muted border-top">
          &copy; 2025 Deeyo Tsai
        </footer>
      </div>
    </main>
  );
};

export default HomeComponent;
