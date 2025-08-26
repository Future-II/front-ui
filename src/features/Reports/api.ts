import axiosInstance from "../../shared/api/axiosInstance";

export const taqeemLogin = async (email: string, password: string, otp?: string) => {
  try {
    const response = await axiosInstance.post('/scripts/taqeemLogin', {
      email,
      password,
      otp, 
    });
    return response.data;
  } catch (error) {
    throw new Error('Error logging in');
  }
};

export const uploadFiles = async (excelFile: File, pdfFiles: any[]) => {
  const formData = new FormData();
  formData.append('excel', excelFile);

  Array.from(pdfFiles).forEach(file => {
    formData.append('pdfs', file);
  });

  try {
    const response = await axiosInstance.post('/scripts/taqeemLogin', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Error uploading files');
  }
};
