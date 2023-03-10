import { AxiosError } from "axios";
import axiosClient from "../../axiosClient";
import Cookies from "js-cookie";

export const getCharactersService = async () => {
  const jwt = Cookies.get("jwt");
  try {
    const res = await axiosClient.get(`/user/getUserCharacters`, {
      headers: { authorization: jwt },
    });
    const result = {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      error: "",
    };
    return result;
  } catch (err) {
    const errors: any = err as AxiosError;
    const result = {
      error: errors.code,
      status: errors.response?.status,
      data: errors.response?.data,
    };
    return result;
  }
};
