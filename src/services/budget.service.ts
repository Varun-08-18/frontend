import api from "./api";

export interface Budget {
  id: number;
  categoryId: number;
  month: number;
  year: number;
  limit: number;
  spent: number;
}

export interface CreateBudgetData {
  categoryId: number;
  month: number;
  year: number;
  limit: number;
}

export interface UpdateBudgetData {
  categoryId?: number;
  month?: number;
  year?: number;
  limit?: number;
}

export async function getBudgets(): Promise<Budget[]> {
  const response = await api.get("/budgets");
  return response.data;
}

export async function getBudget(id: number): Promise<Budget> {
  const response = await api.get(`/budgets/${id}`);
  return response.data;
}

export async function createBudget(
  data: CreateBudgetData,
): Promise<Budget> {
  const response = await api.post("/budgets", data);
  return response.data;
}

export async function updateBudget(
  id: number,
  data: UpdateBudgetData,
): Promise<Budget> {
  const response = await api.put(`/budgets/${id}`, data);
  return response.data;
}

export async function deleteBudget(id: number) {
  const response = await api.delete(`/budgets/${id}`);
  return response.data;
}