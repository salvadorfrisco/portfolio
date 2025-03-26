import axios from "axios";

export const saveLead = async (data: {
  fullName: string;
  email?: string;
  phone: string;
}) => {
  const imagePrefix = process.env.NEXT_PUBLIC_API_PREFIX || "";
  const response = await axios.post(`${imagePrefix}/api/leads`, {
    name: data.fullName,
    email: data.email,
    phone: data.phone,
  });
  return response.data;
};
