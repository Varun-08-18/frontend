"use client";

import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await login(email, password);

      // Save token and user
      localStorage.setItem("token", data.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Redirect based on role (optional)
      router.push("/dashboard");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Paper sx={{ p: 4, width: 400 }}>
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}
        >
          Smart Expense Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{ mt: 3 }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
        </Button>

        <Typography
          variant="body2"
          sx={{ mt: 2, textAlign: "center" }}
          color="text.secondary"
        >
          Try: admin@example.com / password123
        </Typography>
      </Paper>
    </Box>
  );
}