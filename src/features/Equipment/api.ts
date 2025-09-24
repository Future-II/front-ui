import { api } from "../../shared/utils/api";

export const addEquipmentReport = async (
  baseData: any,
  excelFile: File,
  pdfFiles: File[]
) => {
  const formData = new FormData();

  // Use the correct key expected by backend
  formData.append("baseData", JSON.stringify(baseData));

  // Add excel file
  formData.append("excel", excelFile);

  // Add pdf files
  pdfFiles.forEach(file => formData.append('pdfs', file));

  try {
    const response = await api.post("/scripts/equip/fillForm", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error adding report:", error);
    throw new Error("Error adding report");
  }
};

export const getAllAssets = async () => {
  try {
    const response = await api.get("/scripts/equip/assets");
    return response.data;
  } catch (error) {
    console.error("Error getting assets:", error);
    throw new Error("Error getting assets");
  }
};

export const uploadAssetsToDB = async (reportId: string, excelFile: File) => {
  const formData = new FormData();
  formData.append("reportId", reportId);
  formData.append("excel", excelFile);

  try {
    const response = await api.post("/scripts/equip/extractData", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading assets to DB:", error);
    throw new Error("Error uploading assets to DB");
  }
};

export const addAssetsToReport = async (reportId: string) => {

  try {
    const response = await api.post("/scripts/equip/addAssets", {reportId});
    return response.data;
  } catch (error) {
    console.error("Error adding assets to report:", error);
    throw new Error("Error adding assets to report");
  }
};

export const checkAssets = async (reportId: string) => {
  try {
    const response = await api.post("/scripts/equip/check", {reportId});
    return response.data;
  } catch (error) {
    console.error("Error checking assets:", error);
    throw new Error("Error checking assets");
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