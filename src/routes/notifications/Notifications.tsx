"use client";

import { Typography, Paper } from "@mui/material";
import MainLayout from "@/components/layout/MainLayout";

export default function Notifications() {
  return (
    <MainLayout>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3 }}>
        Notifications
      </Typography>

      <Paper sx={{ p: 3 }}>
        <Typography color="text.secondary">
          Read / Unread Notifications will come here.
        </Typography>
      </Paper>
    </MainLayout>
  );
}