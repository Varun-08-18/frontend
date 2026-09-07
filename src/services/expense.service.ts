import api from "./api";

export interface Category {
  id: number;
  name: string;
  isActive?: boolean;
}

export interface Expense {
  id: number;
  amount: number;
  date: string;
  categoryId: number;
  category?: Category;
  description: string;
  status: string;
  employeeId: number;
  receiptUrl?: string | null;
}

export interface ExpenseFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  categoryId?: number;
  employeeId?: number;
  dateFrom?: string;
  dateTo?: string;
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export interface ExpenseListResponse {
  data: Expense[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateExpenseData {
  amount: number;
  date: string;
  categoryId: number;
  description: string;
  receiptUrl?: string;
}

export interface UpdateExpenseData {
  amount?: number;
  date?: string;
  categoryId?: number;
  description?: string;
  receiptUrl?: string;
}

// Get expenses
export async function getExpenses(
  filters: ExpenseFilters = {},
): Promise<ExpenseListResponse> {
  const response = await api.get("/expenses", {
    params: filters,
  });

  const result = response.data;

  if (Array.isArray(result)) {
    return {
      data: result,
      total: result.length,
      page: 1,
      limit: result.length || 10,
      totalPages: 1,
    };
  }

  return {
    data: result.data ?? [],
    total: result.total ?? 0,
    page: result.page ?? filters.page ?? 1,
    limit: result.limit ?? filters.limit ?? 10,
    totalPages:
      result.totalPages ??
      Math.ceil(
        (result.total ?? 0) /
          (result.limit ?? filters.limit ?? 10),
      ),
  };
}

// Get active categories
export async function getCategories(): Promise<Category[]> {
  const response = await api.get("/categories/active");

  return response.data;
}

// Get one expense
export async function getExpense(
  id: number,
): Promise<Expense> {
  const response = await api.get(`/expenses/${id}`);

  return response.data;
}

// Create expense
export async function createExpense(
  data: CreateExpenseData,
) {
  const response = await api.post("/expenses", data);

  return response.data;
}

// Update expense
export async function updateExpense(
  id: number,
  data: UpdateExpenseData,
) {
  const response = await api.put(
    `/expenses/${id}`,
    data,
  );

  return response.data;
}

// Approve expense
export async function approveExpense(id: number) {
  const response = await api.post(
    `/expenses/${id}/approve`,
  );

  return response.data;
}

// Reject expense
export async function rejectExpense(id: number) {
  const response = await api.post(
    `/expenses/${id}/reject`,
  );

  return response.data;
}

// Cancel expense
export async function cancelExpense(id: number) {
  const response = await api.post(
    `/expenses/${id}/cancel`,
  );

  return response.data;
}

// Get expense approvals
export async function getExpenseApprovals(
  id: number,
) {
  const response = await api.get(
    `/expenses/${id}/approvals`,
  );

  return response.data;
}

// Upload receipt
export async function uploadReceipt(
  expenseId: number,
  file: File,
) {
  const formData = new FormData();

  formData.append("receipt", file);

  const response = await api.post(
    `/expenses/${expenseId}/receipt`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return response.data;
}