import React, { useState, useEffect } from "react";
import { render } from "react-dom";
import { AgGridColumn, AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

const App = () => {
  const [rowData, setRowData] = useState([]);
  const [gridApi, setGridApi] = useState(null);
  const [gridColumnApi, setGridColumnApi] = useState(null);

  const onGridReady = (params) => {
    setGridApi(params.api);
    setGridColumnApi(params.columnApi);
    const updateData = (data) => params.api.setRowData(data);

    fetch("http://localhost:3001/news")
      .then((result) => result.json())
      .then((rowData) => updateData(rowData));
  };

  function onFirstDataRendered(params) {
    autoSizeAll(false);
  }

  function refreshData() {
    fetch("http://localhost:3001/new-news")
      .then((result) => result.json())
      .then((rowData) => setRowData(rowData));
  }

  const sizeToFit = () => {
    gridApi.sizeColumnsToFit();
  };

  const autoSizeAll = (skipHeader) => {
    const allColumnIds = [];
    gridColumnApi.getAllColumns().forEach((column) => {
      allColumnIds.push(column.colId);
    });
    gridColumnApi.autoSizeColumns(allColumnIds, skipHeader);
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <h1>Latest Shipping News</h1>
      <div
        className="outer-div"
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <div className="button-bar" style={{ marginBottom: "1rem" }}>
          <button onClick={() => sizeToFit()}>Size to Fit</button>
          <div
            class="divider"
            style={{ width: "5px", height: "auto", display: "inline-block" }}
          />
          <button onClick={() => autoSizeAll(false)}>Auto-Size All</button>
          <div
            class="divider"
            style={{ width: "5px", height: "auto", display: "inline-block" }}
          />
          <button onClick={() => refreshData()}>Refresh Data</button>
        </div>
        <div className="grid-wrapper" style={{ flex: "1 1 auto" }}>
          <div
            className="ag-theme-alpine"
            style={{ width: "100%", height: "100%" }}
          >
            <AgGridReact
              defaultColDef={{
                flex: 1,
                minWidth: 200,
                resizable: true,
                filter: true,
                sortable: true,
                floatingFilter: true,
              }}
              enableCellTextSelection={true}
              ensureDomOrder={true}
              rowData={rowData}
              onGridReady={onGridReady}
              onFirstDataRendered={onFirstDataRendered}
            >
              <AgGridColumn
                field="date"
                filter="agDateColumnFilter"
                filterParams={filterParams}
              ></AgGridColumn>
              <AgGridColumn field="headline"></AgGridColumn>
              <AgGridColumn field="source"></AgGridColumn>
              <AgGridColumn field="description"></AgGridColumn>
              <AgGridColumn
                field="link"
                cellRenderer={(params) => {
                  var link = document.createElement("a");
                  link.href = params.value;
                  link.innerText = "Visit";
                  link.target = "_blank";
                  link.addEventListener("click", (e) => {
                    console.log(params.data.id);
                  });
                  return link;
                }}
              ></AgGridColumn>
            </AgGridReact>
          </div>
        </div>
      </div>
    </div>
  );
};

var filterParams = {
  comparator: function (filterLocalDateAtMidnight, cellValue) {
    var dateAsString = cellValue;
    if (dateAsString == null) return -1;
    var dateParts = dateAsString.split("/");
    var cellDate = new Date(
      Number(dateParts[2]),
      Number(dateParts[1]) - 1,
      Number(dateParts[0])
    );
    if (filterLocalDateAtMidnight.getTime() === cellDate.getTime()) {
      return 0;
    }
    if (cellDate < filterLocalDateAtMidnight) {
      return -1;
    }
    if (cellDate > filterLocalDateAtMidnight) {
      return 1;
    }
  },
  browserDatePicker: true,
  minValidYear: 2000,
  maxValidYear: 2021,
};

render(<App />, document.getElementById("root"));

export default App;
