import React, { useState, useEffect } from "react";
import InputFormElement from "./elements/input-form-element";
// import FmaTableElement from "./elements/fma-table-element";
const FmaTableComponent = ({
  currentUser,
  setCurrentUser,
  defectArr,
  setDefectArr,
  othersColSpan,
  setOthersColSpan,
}) => {
  const title = "FMA填寫表格";
  // const btnValue = "送出表單";
  //======FMA填寫表格======
  //variant props for input-form-element.js
  const currentDate = new Date().toLocaleDateString("sv");
  // const currentDateTime = new Date().toLocaleString("sv");

  let [employee, setEmployee] = useState(
    currentUser.user.employee ? currentUser.user.employee : ""
  );
  let [pickdate, setPickdate] = useState(currentDate);
  let [line, setLine] = useState("");
  let [product, setProduct] = useState("");
  //   let [rowdata, setRowdata] = useState("");

  useEffect(() => {
    // setEmployee(currentUser.user.employee);
  }, []);
  return (
    <div className="fma-table-component">
      <InputFormElement
        cardHeader={title}
        // btnClick={handleBtnEvent}
        // btnValue={btnValue}
        currentUser={currentUser}
        currentDate={currentDate}
        // currentDateTime={currentDateTime}
        employee={employee}
        setEmployee={setEmployee}
        pickdate={pickdate}
        setPickdate={setPickdate}
        line={line}
        setLine={setLine}
        product={product}
        setProduct={setProduct}
        defectArr={defectArr}
        setDefectArr={setDefectArr}
        othersColSpan={othersColSpan}
        setOthersColSpan={setOthersColSpan}
      />
      {/* <FmaTableElement /> */}
    </div>
  );
};

export default FmaTableComponent;
