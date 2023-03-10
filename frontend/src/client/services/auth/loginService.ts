import { AxiosError } from "axios";
import axiosClient from "../../axiosClient";
import Cookies from 'js-cookie';

export interface signInInterface {
  accountname: string;
  password: string;
}

export const signInService = async (body: signInInterface) => {
  const jwt = Cookies.get("jwt");
  try {
    const res = await axiosClient.post(
      "/login",
      {
        accountname: body.accountname,
        password: body.password,
      }
    );
    const result = {
      data: res.data,
      status: res.status,
      statusText: res.statusText,
      headers: res.headers,
      error: "",
    };
    return result;
  } catch (err) {
    const errors = err as AxiosError;
    const result: any = {
      data: errors.response?.data,
      error: errors.message,
      status: errors.response?.status,
    };
    return result;
  }
};
