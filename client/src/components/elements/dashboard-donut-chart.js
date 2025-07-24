import * as React from "react";
import { PieChart } from "@mui/x-charts/PieChart";
import { Box, Typography } from "@mui/material";
const data = [
  { label: "Group A", value: 400, color: "#0088FE" },
  { label: "Group B", value: 300, color: "#00C49F" },
  { label: "Group C", value: 300, color: "#FFBB28" },
  { label: "Group D", value: 200, color: "#FF8042" },
];

const settings = {
  margin: { right: 5 },
  width: 200,
  height: 220,
  hideLegend: true,
};

export default function DonutChart() {
  return (
    <div className="card p-2 my-1">
      <Box sx={{ position: "relative" }}>
        <PieChart
          series={[
            {
              data,
              innerRadius: 50, // Creates the donut hole
              outerRadius: 100,
              arcLabel: "value",
            },
          ]}
          //   width={400}
          //   height={300}
          {...settings}
        />
        <Typography
          variant="h6" // Or any appropriate variant
          sx={{
            position: "absolute",
            top: "50%",
            left: "48%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            pointerEvents: "none", // Prevents text from interfering with chart interactions
          }}
        >
          Total: 45
        </Typography>
      </Box>
    </div>
  );
}
