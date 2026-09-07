"use client";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

interface ChartData {
  label: string;
  value: number;
}

interface ExpenseChartProps {
  title: string;
  data: ChartData[];
}

export default function ExpenseChart({
  title,
  data,
}: ExpenseChartProps) {
  const maxValue = Math.max(
    ...data.map((item) => item.value),
    1,
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        backgroundColor: "#ffffff",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          mb: 3,
        }}
      >
        {title}
      </Typography>

      {data.length === 0 ? (
        <Box
          sx={{
            height: 250,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography color="text.secondary">
            No data available
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            height: 250,
            display: "flex",
            alignItems: "flex-end",
            gap: 2,
            overflowX: "auto",
            px: 1,
          }}
        >
          {data.map((item) => {
            const height =
              (item.value / maxValue) * 200;

            return (
              <Box
                key={item.label}
                sx={{
                  minWidth: 70,
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  alignItems: "center",
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    mb: 1,
                    fontWeight: 600,
                  }}
                >
                  ₹{item.value.toLocaleString()}
                </Typography>

                <Box
                  sx={{
                    width: 40,
                    height,
                    minHeight: 5,
                    borderRadius:
                      "6px 6px 0 0",
                    backgroundColor:
                      "primary.main",
                    transition:
                      "height 0.3s ease",
                  }}
                />

                <Typography
                  variant="caption"
                  sx={{
                    mt: 1,
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Box>
      )}
    </Paper>
  );
}