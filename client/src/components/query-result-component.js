import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import FmaTableElement from "./elements/fma-table-element";
import FmaEchartElement from "./elements/fma-echart-element";
import DefectTableElement from "./elements/defect-table-element";
import fmaService from "../services/fma.service";
import { useNavigate } from "react-router-dom";

const QueryResultComponent = (props) => {
  //   return <div>QueryResultComponent</div>;
  const navigate = useNavigate();
  const { state } = useLocation();
  let dt;
  let [emp, setEmp] = useState("");
  let [lot, setLot] = useState("");
  let [line, setLine] = useState("");
  let [product, setProduct] = useState("");
  const { rowData, id } = state;

  let [isReadyOnly, setIsReadyOnly] = useState(true);

  let [glassDataSet, setGlassDataSet] = useState("");
  // For barChart --> all Total Num data
  let [dfAvgForBar, setDfAvgForBar] = useState([]);

  // For lineChart --> all Avg Num data
  let [dfRatioForLine, setDfRatioForLine] = useState([]);
  let [sortedDfArr, setSortedDfArr] = useState([]);
  // console.log(JSON.parse(rowData).data.foundData[id]);
  let [standardRowNum, setStandardRowNum] = useState(0);

  const handleEmp = (e) => {
    setEmp(e.target.value);
  };
  const handleLot = (e) => {
    setLot(e.target.value);
  };
  const handleProduct = (e) => {
    setProduct(e.target.value);
  };
  const handleReadOnly = () => {
    isReadyOnly ? setIsReadyOnly(false) : setIsReadyOnly(true);
  };

  const handleSubmit = () => {
    // const submitData =
    console.log(glassDataSet);
  };

  const handleBackQuery = () => {
    // console.log(rowData);
    navigate("/fmaquery", {
      state: { rowData: rowData },
    });
  };

  useEffect(() => {
    const fetchOutlineData = async () => {
      let dataObj = JSON.parse(rowData).data.foundData;
      dataObj.forEach((e) => {
        if (e.id == id) {
          dt = new Date(e.datetime).toLocaleString("sv");
          setEmp(e.emp);
          setLot(e.lot);
          setLine(e.line);
          setProduct(e.product);
        }
      });
    };

    const fetchFmatbData = async () => {
      const data = (await fmaService.queryByOutlineId(id)).data.foundData;
      setGlassDataSet(data);
      setStandardRowNum(data.length);
      // console.log(data);

      // setStandardRowNum()
    };
    fetchOutlineData();
    fetchFmatbData();
  }, []);

  return (
    <div>
      {/* {JSON.stringify(props.currentUser)} */}
      <div className="fma-check-detail" style={{ padding: "2.5rem" }}>
        <div className="card text-center">
          <h3 className="card-header">FMA Result</h3>
          <div className="card-body mt-2 me-3">
            <div className="mb-3 text-center">
              <label htmlFor="staticEmail" className="text-center fs-4">
                日期時間 : {dt}
              </label>
            </div>
            <div className="d-flex justify-content-center align-items-center mb-2">
              <div id="employee" className="d-flex me-3 w-50">
                <label
                  htmlFor="employee"
                  className="col-sm-1 col-form-label"
                  // style={{ width: "3rem" }}
                >
                  工號:
                </label>
                <input
                  // onChange={handleEmployee}
                  type="text"
                  className="form-control"
                  name="employee"
                  placeholder="請輸入FMA人員工號"
                  onChange={handleEmp}
                  value={emp}
                  readOnly={isReadyOnly}
                  disabled={isReadyOnly}
                />
              </div>
              <div id="lot" className="d-flex w-50">
                <label
                  htmlFor="lot"
                  className="col-sm-1 col-form-label "
                  // style={{ width: "3rem" }}
                >
                  LOT:
                </label>
                <input
                  onChange={handleLot}
                  type="text"
                  className="form-control"
                  name="lot"
                  placeholder="請輸入LOT"
                  value={lot}
                  readOnly={isReadyOnly}
                  disabled={isReadyOnly}
                />
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center mb-2">
              <div id="line" className="d-flex me-3 w-50">
                <label
                  htmlFor="line"
                  className="col-sm-1 col-form-label"
                  // style={{ width: "3rem" }}
                >
                  產線:
                </label>
                <select
                  // onChange={handleLine}
                  className="form-select"
                  value={line}
                  readOnly={isReadyOnly}
                  disabled={isReadyOnly}
                >
                  <option value="DEFAULT" disabled>
                    ---請選擇Line別---
                  </option>
                  <option value="R1">R1</option>
                  <option value="R2">R2</option>
                  <option value="G1">G1</option>
                  <option value="G2">G2</option>
                  <option value="B1">B1</option>
                  <option value="B2">B2</option>
                </select>
              </div>
              <div id="product" className="d-flex w-50">
                <label
                  htmlFor="product"
                  className="col-sm-1 col-form-label"
                  // style={{ width: "3rem" }}
                >
                  品名:
                </label>
                <input
                  onChange={handleProduct}
                  type="text"
                  className="form-control"
                  name="product"
                  placeholder="ex:G190ACMB"
                  value={product}
                  readOnly={isReadyOnly}
                  disabled={isReadyOnly}
                />
              </div>
            </div>
            <div className="d-flex justify-content-center align-items-center mt-4 mb-3">
              {/* <div className="d-flex w-50 justify-content-end me-3"> */}
              <button
                className="btn btn-warning btn col-sm-1 me-2"
                onClick={handleReadOnly}
              >
                <span>編輯資料</span>
              </button>
              {/* </div> */}
              {/* <div className="d-flex w-50 justify-content-start"> */}
              <button
                className="btn btn-info btn col-sm-1 me-2"
                onClick={handleSubmit}
              >
                <span>確認送出</span>
              </button>
              <button
                className="btn btn-secondary btn col-sm-1 me-2"
                onClick={handleBackQuery}
              >
                <span>返回上頁</span>
              </button>
              {/* </div> */}
            </div>
          </div>
          <div className="card-body text-center">
            {/* {message && <div className="alert alert-danger">{message}</div>} */}

            <FmaTableElement
              currentUser={props.currentUser}
              employee={emp}
              setEmployee={setEmp}
              line={line}
              setLine={setLine}
              product={product}
              setProduct={setProduct}
              standardRowNum={standardRowNum}
              setStandardRowNum={setStandardRowNum}
              dfAvgForBar={dfAvgForBar}
              setDfAvgForBar={setDfAvgForBar}
              dfRatioForLine={dfRatioForLine}
              setDfRatioForLine={setDfRatioForLine}
              defectArr={props.defectArr}
              glassDataSet={glassDataSet}
              setGlassDataSet={setGlassDataSet}
              editable={isReadyOnly}
            />
          </div>
          <div className="card-body pb-4">
            <FmaEchartElement
              dfAvgForBar={dfAvgForBar}
              setDfAvgForBar={setDfAvgForBar}
              dfRatioForLine={dfRatioForLine}
              setDfRatioForLine={setDfRatioForLine}
              defectArr={props.defectArr}
              product={product}
              sortedDfArr={sortedDfArr}
              setSortedDfArr={setSortedDfArr}
            />
          </div>
          <div className="card-body pt-2 pb-4">
            <DefectTableElement
              defectArr={props.defectArr}
              glassDataSet={glassDataSet}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QueryResultComponent;
