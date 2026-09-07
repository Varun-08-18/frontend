import api from "./api";

export interface MonthlyTotal {
  month: number;
  year: number;
  total: number;
  count: number;
}

export interface CategoryWiseReport {
  category: string;
  total: number;
  count: number;
}

export interface EmployeeWiseReport {
  employeeId: number;
  total: number;
  count: number;
}

export interface BudgetVsActual {
  budgetId: number;
  categoryId: number;
  month: number;
  year: number;
  budgetLimit: number;
  actualSpent: number;
  remaining: number;
}

export interface PendingApprovals {
  pendingApprovals: number;
}

export interface SixMonthTrend {
  month: number;
  year: number;
  total: number;
}

// ==========================================
// MONTHLY TOTAL
// ==========================================

export async function getMonthlyTotal(): Promise<
  MonthlyTotal[]
> {
  const response = await api.get(
    "/reports/monthly-total",
  );

  return response.data;
}

// ==========================================
// CATEGORY-WISE
// ==========================================

export async function getCategoryWise(): Promise<
  CategoryWiseReport[]
> {
  const response = await api.get(
    "/reports/category-wise",
  );

  return response.data;
}

// ==========================================
// TOP 5 CATEGORIES
// ==========================================

export async function getTopCategories(): Promise<
  CategoryWiseReport[]
> {
  const response = await api.get(
    "/reports/top-categories",
  );

  return response.data;
}

// ==========================================
// EMPLOYEE-WISE
// ==========================================

export async function getEmployeeWise(): Promise<
  EmployeeWiseReport[]
> {
  const response = await api.get(
    "/reports/employee-wise",
  );

  return response.data;
}

// ==========================================
// BUDGET VS ACTUAL
// ==========================================

export async function getBudgetVsActual(): Promise<
  BudgetVsActual[]
> {
  const response = await api.get(
    "/reports/budget-vs-actual",
  );

  return response.data;
}

// ==========================================
// PENDING APPROVALS
// ==========================================

export async function getPendingApprovals(): Promise<
  PendingApprovals
> {
  const response = await api.get(
    "/reports/pending-approvals",
  );

  return response.data;
}

// ==========================================
// SIX MONTH TREND
// ==========================================

export async function getSixMonthTrend(): Promise<
  SixMonthTrend[]
> {
  const response = await api.get(
    "/reports/six-month-trend",
  );

  return response.data;
}