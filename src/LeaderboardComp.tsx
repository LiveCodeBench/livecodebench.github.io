import {
  Streamlit,
  StreamlitComponentBase,
  withStreamlitConnection,
} from "streamlit-component-lib"

import React, { useCallback, useMemo, useRef, useEffect, useState } from "react"
import Grid from '@mui/material/Grid';
import { AgGridReact } from "ag-grid-react"
import "ag-grid-community/styles/ag-grid.css" // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css" // Theme
import "./LeaderboardComp.css"
import Box from "@mui/material/Box"
import Slider from "@mui/material/Slider"
import { ThemeProvider, createTheme } from "@mui/material/styles"
import CssBaseline from "@mui/material/CssBaseline"

import {
  getColumnDefs,
  getDateMarksFromTimestamps,
  getLeaderboard,
} from "./leaderboardLib"

import "./LeaderboardAgGrid.css"
import styles from "./Leaderboard.module.css"
const FONT_FAMILY = "'JetBrains Mono', monospace"

const Leaderboard = React.memo(function LeaderboardComponent(props: any) {
  // args from Streamlit
  let args = props.args;
  const { performances, models, date_marks } = args;


  // const [data, setData] = useState(args);

  // console.log(props)
  // console.log(performances)
  // console.log(models)




  const modelsDict = useMemo(() => {
    return models.reduce((acc: any, model: any) => {
      acc[model.model_repr] = model
      return acc
    }, {})
  }, [models])


  // ********* DateSlider *********

  // const dateMarks = getDateMarksFromTimestamps(date_marks)
  const [dateMarks, setDateMarks] = React.useState(() => getDateMarksFromTimestamps(date_marks));

  useEffect(() => {
    console.log('Component re-rendered due to changes in date_marks:', date_marks);
    setDateMarks(getDateMarksFromTimestamps(date_marks));
  }, [date_marks]);

  const [dateStartAndEnd, setDateStartAndEnd] = React.useState<number[]>([
    dateMarks[1].value, // Right now, this is 2023-05-01
    dateMarks[dateMarks.length - 1].value,
  ])


  const dateSliderHandleChange = (
    event: Event,
    newValue: number | number[]
  ) => {
    const newValueArray = newValue as number[]
    setDateStartAndEnd(newValueArray)

    const newDf = getLeaderboard(
      performances,
      models,
      newValueArray[0],
      newValueArray[1]
    )

    const newRowData: any[] = []

    const res = (gridRef.current as any).api.forEachNode(function (node: any) {
      // Identify by the "Model" field
      const dfData = newDf.find((row) => row["Model"] === node.data["Model"])!

      const newData = node.data
      for (const key in dfData) {
        newData[key] = dfData[key as keyof typeof dfData]
      }

      newRowData.push(newData)
    })

    const resTransaction = (gridRef.current as any).api.applyTransaction({
      update: newRowData,
    })
  }

  function dateLabelFormat(value: number) {
    const index = dateMarks.findIndex((mark) => mark.value === value)
    return dateMarks[index].label
  }

  const dateAriaText = dateLabelFormat

  // ********* AgGrid *********

  // const leaderboard = getLeaderboard(
  //   performances,
  //   models,
  //   dateStartAndEnd[0],
  //   dateStartAndEnd[1]
  // )

  const leaderboard = useMemo(() => {
    return getLeaderboard(
      performances,
      models,
      dateStartAndEnd[0],
      dateStartAndEnd[1]
    );
  }, [performances, models, dateStartAndEnd]);


  // console.log(leaderboard)


  const numProblems = performances.filter(
    (result: any) =>
      result["model"] === "GPT-3.5-Turbo-0301" &&
      result["date"] >= dateStartAndEnd[0] &&
      result["date"] <= dateStartAndEnd[1]
  ).length;


  // df is an array of objects
  // Get the columns of df
  const columnNames = useMemo(() => {
    return Object.keys(leaderboard[0])
  }, [leaderboard]);

  // Object.keys(leaderboard[0])

  const defaultColDef = useMemo(() => {
    return {
      flex: 1,
    }
  }, [])

  const rowClassRules = useMemo(() => {
    return {
      [styles.leaderboardModelContaminated]: (params: any) =>
        params.data["Contaminated"],
    }
  }, [])

  const gridRef = useRef()
  const [rowData, setRowData] = useState(leaderboard)

  useEffect(() => {
    console.log('Component re-rendered due to changes in leaderboard:', leaderboard);
    setRowData(leaderboard);
  }, [leaderboard]);

  const [columnDefs, setColumnDefs] = useState(
    getColumnDefs(columnNames, modelsDict)
  )

  useEffect(() => {
    console.log('Component re-rendered due to changes in column:', columnNames, modelsDict);
    setColumnDefs(getColumnDefs(columnNames, modelsDict));
  }, [columnNames, modelsDict]);


  // console.log(columnNames, modelsDict);
  // ********* Styles and return *********

  const muiTheme = createTheme({
    palette: {
      mode: props.theme.base,
    },
    typography: {
      fontFamily: FONT_FAMILY,
    },
  })

  const agGridTheme =
    props.theme.base === "dark" ? "ag-theme-quartz-dark" : "ag-theme-quartz"

  const gridStyle = useMemo(
    () => ({
      // height: "1250px",
      height: 42 * rowData.length + "px",
      // minWidth: "760px",
      // maxWidth: "100%",
      "--ag-font-family": FONT_FAMILY,
    }),
    [rowData]
  )

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <div style={{ display: "flex", justifyContent: "center" }}>
          <b>Current number of problems - {numProblems}. Select a time-window for filtering problems</b>
        </div>


        <Box sx={{ width: "100%" }} px={6} pt={5} pb={2}>

          <Grid container justifyContent="center">
            <Grid item xs={12}>

              <Slider
                aria-label="Date Slider"
                value={dateStartAndEnd}
                onChange={dateSliderHandleChange}
                valueLabelFormat={dateLabelFormat}
                getAriaValueText={dateAriaText}
                step={null}
                valueLabelDisplay="on"
                marks={dateMarks}
                min={dateMarks[0].value}
                max={dateMarks[dateMarks.length - 1].value}
              />
            </Grid>
          </Grid>
        </Box>
      </ThemeProvider>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: "100%" }} id='flexGridWrapper'>
          <div style={{ flexGrow: "1", width: "100%", display: "flex", justifyContent: "center" }}> {/* Center the grid */}
            <div style={gridStyle} className={agGridTheme}>
              {/* @ts-ignore */}

              <AgGridReact
                ref={gridRef}
                rowData={rowData}
                columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowClassRules={rowClassRules}
                rowSelection={"multiple"}
                enableCellTextSelection={true}
                tooltipShowDelay={0}
              />
            </div>
          </div>
        </div>
      </div>
    </div >
  )
});

// // This line is changed from the original streamlit code
// export default withStreamlitConnection(Leaderboard)
export default Leaderboard
