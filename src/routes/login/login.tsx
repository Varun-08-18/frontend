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
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await login({
        email,
        password,
      });

      router.push("/dashboard");
    } catch (err: any) {
      setError(
        err?.response?.data?.message || "Login failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background Video */}
      <Box
        component="video"
        autoPlay
        muted
        loop
        playsInline
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: 0,
        }}
      >
        <source
          src="/login-bg.mp4"
          type="video/mp4"
        />
      </Box>

      {/* Dark Overlay */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          zIndex: 1,
        }}
      />

      {/* Login Box */}
      <Paper
        elevation={10}
        sx={{
          position: "relative",
          zIndex: 2,
          p: 4,
          width: 400,
          maxWidth: "90%",
          borderRadius: 3,
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 3,
            textAlign: "center",
          }}
        >
          Smart Expense Login
        </Typography>

        {error && (
          <Alert
            severity="error"
            sx={{ mb: 2 }}
          >
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        <Button
          fullWidth
          variant="contained"
          size="large"
          sx={{
            mt: 3,
            py: 1.3,
            fontWeight: "bold",
          }}
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <CircularProgress
              size={24}
              color="inherit"
            />
          ) : (
            "Login"
          )}
        </Button>

        <Typography
          variant="body2"
          sx={{
            mt: 2,
            textAlign: "center",
          }}
          color="text.secondary"
        >
          
        </Typography>
      </Paper>
    </Box>
  );
}