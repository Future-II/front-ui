import { api } from "../../shared/utils/api";

export const addAssetsToReport = async (reportId: string, excelFile: File) => {
  const formData = new FormData();
  formData.append("reportId", reportId);
  formData.append("excel", excelFile);

  try {
    const response = await api.post("/scripts/equip/addAssets", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding assets to report:", error);
    throw new Error("Error adding assets to report");
  }
};

export const taqeemLogin = async (email: string, password: string, otp?: string) => {
  try {
    const response = await api.post('/scripts/equip/login', {
      email,
      password,
      otp, 
    });
    return response.data;

  } catch (error) {
    throw new Error('Error logging in');
  }
};