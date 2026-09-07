"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import MainLayout from "@/components/layout/MainLayout";
import {
  Category,
  getCategories,
} from "@/services/expense.service";
import {
  createBudget,
  CreateBudgetData,
} from "@/services/budget.service";

export default function CreateBudget() {
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [limit, setLimit] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load categories",
        );
      } finally {
        setLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!categoryId || !month || !year || !limit) {
      setError("Please fill all fields");
      return;
    }

    if (Number(limit) <= 0) {
      setError("Budget limit must be greater than 0");
      return;
    }

    if (Number(month) < 1 || Number(month) > 12) {
      setError("Month must be between 1 and 12");
      return;
    }

    if (Number(year) < 2020) {
      setError("Please enter a valid year");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data: CreateBudgetData = {
        categoryId: Number(categoryId),
        month: Number(month),
        year: Number(year),
        limit: Number(limit),
      };

      await createBudget(data);

      router.push("/budgets");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          "Failed to create budget",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            p: 5,
          }}
        >
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Box>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", mb: 3 }}
        >
          Create Budget
        </Typography>

        <Paper sx={{ p: 3, maxWidth: 600 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "grid",
              gap: 2,
            }}
          >
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>

              <Select
                value={categoryId}
                label="Category"
                onChange={(event) =>
                  setCategoryId(event.target.value)
                }
              >
                {categories.map((category) => (
                  <MenuItem
                    key={category.id}
                    value={category.id}
                  >
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Month"
              type="number"
              value={month}
              onChange={(event) =>
                setMonth(event.target.value)
              }
              slotProps={{
                htmlInput: {
                  min: 1,
                  max: 12,
                },
              }}
              fullWidth
            />

            <TextField
              label="Year"
              type="number"
              value={year}
              onChange={(event) =>
                setYear(event.target.value)
              }
              fullWidth
            />

            <TextField
              label="Budget Limit"
              type="number"
              value={limit}
              onChange={(event) =>
                setLimit(event.target.value)
              }
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
              fullWidth
            />

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 1,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                disabled={saving}
              >
                {saving ? "Creating..." : "Create Budget"}
              </Button>

              <Button
                type="button"
                variant="outlined"
                onClick={() => router.push("/budgets")}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </MainLayout>
  );
}