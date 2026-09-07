"use client";

import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import MainLayout from "@/components/layout/MainLayout";

import {
  getMonthlyTotal,
  getCategoryWise,
  getTopCategories,
  getEmployeeWise,
  getBudgetVsActual,
  getPendingApprovals,
  getSixMonthTrend,
  MonthlyTotal,
  CategoryWiseReport,
  EmployeeWiseReport,
  BudgetVsActual,
  SixMonthTrend,
} from "@/services/report.service";

import { getCurrentUser } from "@/services/auth.service";

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [monthlyTotal, setMonthlyTotal] =
    useState<MonthlyTotal[]>([]);

  const [categoryWise, setCategoryWise] =
    useState<CategoryWiseReport[]>([]);

  const [topCategories, setTopCategories] =
    useState<CategoryWiseReport[]>([]);

  const [employeeWise, setEmployeeWise] =
    useState<EmployeeWiseReport[]>([]);

  const [budgetVsActual, setBudgetVsActual] =
    useState<BudgetVsActual[]>([]);

  const [pendingApprovals, setPendingApprovals] =
    useState(0);

  const [sixMonthTrend, setSixMonthTrend] =
    useState<SixMonthTrend[]>([]);

  const [isManagerOrAdmin, setIsManagerOrAdmin] =
    useState(false);

  useEffect(() => {
    const loadReports = async () => {
      try {
        setLoading(true);
        setError("");

        const user = getCurrentUser();

        const managerOrAdmin =
          user?.role === "MANAGER" ||
          user?.role === "ADMIN";

        setIsManagerOrAdmin(managerOrAdmin);

        const [
          monthly,
          category,
          top,
          trend,
        ] = await Promise.all([
          getMonthlyTotal(),
          getCategoryWise(),
          getTopCategories(),
          getSixMonthTrend(),
        ]);

        setMonthlyTotal(monthly);
        setCategoryWise(category);
        setTopCategories(top);
        setSixMonthTrend(trend);

        if (managerOrAdmin) {
          const [
            employees,
            budgets,
            pending,
          ] = await Promise.all([
            getEmployeeWise(),
            getBudgetVsActual(),
            getPendingApprovals(),
          ]);

          setEmployeeWise(employees);
          setBudgetVsActual(budgets);
          setPendingApprovals(
            pending.pendingApprovals,
          );
        }
      } catch (err: any) {
        setError(
          err?.response?.data?.message ||
            "Failed to load reports",
        );
      } finally {
        setLoading(false);
      }
    };

    loadReports();
  }, []);

  const getMonthName = (month: number) => {
    return new Date(
      2000,
      month - 1,
      1,
    ).toLocaleString("en-US", {
      month: "long",
    });
  };

  const getTotalSpent = () => {
    return categoryWise.reduce(
      (total, item) =>
        total + Number(item.total),
      0,
    );
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
          sx={{
            fontWeight: "bold",
            mb: 3,
          }}
        >
          Reports
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {/* TOTAL SPENT */}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 1 }}
          >
            Total Spending
          </Typography>

          <Typography
            variant="h4"
            sx={{ fontWeight: "bold" }}
          >
            ₹{getTotalSpent().toLocaleString()}
          </Typography>
        </Paper>

        {/* MONTHLY TOTAL */}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Monthly Expense Totals
          </Typography>

          {monthlyTotal.length === 0 ? (
            <Typography color="text.secondary">
              No monthly data available.
            </Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>Month</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Year</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Total</strong>
                  </TableCell>

                  <TableCell>
                    <strong>Count</strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {monthlyTotal.map(
                  (item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        {getMonthName(
                          item.month,
                        )}
                      </TableCell>

                      <TableCell>
                        {item.year}
                      </TableCell>

                      <TableCell>
                        ₹
                        {Number(
                          item.total,
                        ).toLocaleString()}
                      </TableCell>

                      <TableCell>
                        {item.count}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          )}
        </Paper>

        {/* CATEGORY-WISE */}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Category-wise Spending
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Category</strong>
                </TableCell>

                <TableCell>
                  <strong>Total</strong>
                </TableCell>

                <TableCell>
                  <strong>Count</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {categoryWise.map(
                (item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item.category}
                    </TableCell>

                    <TableCell>
                      ₹
                      {Number(
                        item.total,
                      ).toLocaleString()}
                    </TableCell>

                    <TableCell>
                      {item.count}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* TOP 5 CATEGORIES */}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            Top 5 Categories
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Category</strong>
                </TableCell>

                <TableCell>
                  <strong>Total</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {topCategories.map(
                (item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {item.category}
                    </TableCell>

                    <TableCell>
                      ₹
                      {Number(
                        item.total,
                      ).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* 6 MONTH TREND */}

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography
            variant="h6"
            sx={{ mb: 2 }}
          >
            6-Month Spending Trend
          </Typography>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Month</strong>
                </TableCell>

                <TableCell>
                  <strong>Year</strong>
                </TableCell>

                <TableCell>
                  <strong>Total</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sixMonthTrend.map(
                (item, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      {getMonthName(
                        item.month,
                      )}
                    </TableCell>

                    <TableCell>
                      {item.year}
                    </TableCell>

                    <TableCell>
                      ₹
                      {Number(
                        item.total,
                      ).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ),
              )}
            </TableBody>
          </Table>
        </Paper>

        {/* MANAGER / ADMIN REPORTS */}

        {isManagerOrAdmin && (
          <>
            {/* PENDING APPROVALS */}

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 1 }}
              >
                Pending Approvals
              </Typography>

              <Typography
                variant="h4"
                sx={{ fontWeight: "bold" }}
              >
                {pendingApprovals}
              </Typography>
            </Paper>

            {/* EMPLOYEE-WISE */}

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                Employee-wise Spending
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>
                        Employee ID
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>Total</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Count</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {employeeWise.map(
                    (item) => (
                      <TableRow
                        key={
                          item.employeeId
                        }
                      >
                        <TableCell>
                          {item.employeeId}
                        </TableCell>

                        <TableCell>
                          ₹
                          {Number(
                            item.total,
                          ).toLocaleString()}
                        </TableCell>

                        <TableCell>
                          {item.count}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </Paper>

            {/* BUDGET VS ACTUAL */}

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography
                variant="h6"
                sx={{ mb: 2 }}
              >
                Budget vs Actual
              </Typography>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>
                        Budget ID
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Month
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>Year</strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Budget Limit
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Actual Spent
                      </strong>
                    </TableCell>

                    <TableCell>
                      <strong>
                        Remaining
                      </strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {budgetVsActual.map(
                    (item) => (
                      <TableRow
                        key={item.budgetId}
                      >
                        <TableCell>
                          {item.budgetId}
                        </TableCell>

                        <TableCell>
                          {getMonthName(
                            item.month,
                          )}
                        </TableCell>

                        <TableCell>
                          {item.year}
                        </TableCell>

                        <TableCell>
                          ₹
                          {Number(
                            item.budgetLimit,
                          ).toLocaleString()}
                        </TableCell>

                        <TableCell>
                          ₹
                          {Number(
                            item.actualSpent,
                          ).toLocaleString()}
                        </TableCell>

                        <TableCell>
                          ₹
                          {Number(
                            item.remaining,
                          ).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ),
                  )}
                </TableBody>
              </Table>
            </Paper>
          </>
        )}
      </Box>
    </MainLayout>
  );
}