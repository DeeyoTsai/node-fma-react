import React, {
  useRef,
  useCallback,
  useMemo,
  useState,
  useEffect,
} from "react";

// import {
//   ClientSideRowModelModule,
//   ModuleRegistry,
//   NumberFilterModule,
//   RowDragModule,
//   RowSelectionModule,
//   TextFilterModule,
//   ValidationModule,
// } from "ag-grid-community";
import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";
import { AgGridReact } from "ag-grid-react";
// import { useFetchJson } from "./fetchTestData";

const DefectTableElement = (props) => {
  ModuleRegistry.registerModules([AllCommunityModule]);
  let [rowData, setRowData] = useState([]);
  const gridRef = useRef(null);
  const containerStyle = useMemo(() => ({ width: "100%", height: "100%" }), []);
  const gridStyle = useMemo(() => ({ height: "100%", width: "100%" }), []);

  // Column Definitions: Defines the columns to be displayed.
  const [colDefs, setColDefs] = useState([
    { field: "時間", rowDrag: true },
    { field: "glassID" },
    { field: "x" },
    { field: "y" },
    { field: "predict" },
    {
      field: "manual",
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: props.defectArr,
      },
    },
    { field: "image", width: 100 },
    // { field: "athlete", rowDrag: true },
    { field: "country" },
    // { field: "year", width: 100 },
    // { field: "date" },
    // { field: "sport" },
    // { field: "gold" },
    // { field: "silver" },
    // { field: "bronze" },
  ]);

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
      filter: true,
      editable: true,
    };
  }, []);
  const rowSelection = useMemo(() => {
    return { mode: "multiRow" };
  }, []);

  // const { data, loading } = useFetchJson(
  //   "https://www.ag-grid.com/example-assets/olympic-winners.json",
  //   5
  // );

  useEffect(() => {
    // console.log(rowData);
    if (props.glassDataSet) {
      setRowData(props.glassDataSet);
    }
  }, [props.glassDataSet]);

  const handleGetData = () => {
    setRowData(props.glassDataSet);
    // setRowData(data);
    // console.log(rowData);
  };
  const handleDelete = useCallback(() => {
    const selectedData = gridRef.current.api.getSelectedRows();
    const res = gridRef.current.api.applyTransaction({ remove: selectedData });
    console.log(res);
  }, []);

  return (
    <div>
      <h4 className="card-title text-center fw-bold">FMA Table</h4>
      <div className="btn-gp d-flex mb-2">
        <button
          type="button"
          className="btn btn-success p-2 m-1"
          onClick={handleGetData}
        >
          Refresh
        </button>
        <button className="btn btn-danger p-2 m-1" onClick={handleDelete}>
          Delete
        </button>
        <button className="btn btn-primary ms-auto p-2 m-1">更新表單</button>
      </div>
      <div style={{ width: "100%", height: 500 }}>
        <div style={containerStyle}>
          <div style={gridStyle}>
            <AgGridReact
              ref={gridRef}
              rowData={rowData}
              // loading={loading}
              columnDefs={colDefs}
              defaultColDef={defaultColDef}
              rowDragManaged={true}
              rowDragMultiRow={true}
              rowSelection={rowSelection}
            />
          </div>
        </div>
      </div>
      <div>{JSON.stringify(props.glassDataSet)}</div>
    </div>
  );
};

export default DefectTableElement;
