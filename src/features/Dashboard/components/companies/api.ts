import { api } from "../../../../shared/utils/api";

export const createCompany = async (data: any) => {
  const response = await api.post('/companies', data);
  return response.data;
};

export const getCompanies = async () => {
  const response = await api.get('/companies');
  return response.data;
};

export const addUserToCompany = async (companyId: string, userData: any) => {
  const response = await api.post(`/companies/${companyId}/users`, userData);
  return response.data;
};

export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const getAllTickets = async () => {
  const response = await api.get('/tickets');
  return response.data;
};

export const getCompanyById = async (companyId: string) => {
  const response = await api.get(`/companies/${companyId}`);
  return response.data;
};

export const updateCompany = async (companyId: string, data: any) => {
  const response = await api.put(`/companies/${companyId}`, data);
  return response.data;
};

export const getUsersByCompany = async (companyId: string) => {
  const response = await api.get(`/companies/${companyId}/users`);
  return response.data;
};

export const updateUser = async (userId: string, data: any) => {
  const response = await api.put(`/users/${userId}`, data);
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};
