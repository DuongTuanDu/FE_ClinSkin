import axios from "axios";

const GHN_API = import.meta.env.VITE_APP_API_SHIP_URL;
const GHN_TOKEN = import.meta.env.VITE_APP_TOKEN_SHIP;

const ghnClient = axios.create({
  baseURL: GHN_API,
  headers: {
    Token: GHN_TOKEN,
  },
});

export const getProvinces = async () => {
  const res = await ghnClient.get("/master-data/province");
  return res.data.data;
};

export const getDistrictsByProvinceId = async (provinceId) => {
  const res = await ghnClient.post("/master-data/district", {
    province_id: provinceId,
  });
  return res.data.data;
};

export const getWardsByDistrictId = async (districtId) => {
  const res = await ghnClient.post("/master-data/ward", {
    district_id: districtId,
  });
  return res.data.data;
};
