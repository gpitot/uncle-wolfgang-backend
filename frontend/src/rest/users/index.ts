import axios from "axios";
import { IJsonResponse, BASE_URL, IResultResponse } from "rest/common";

export interface IUser {
  email: string;
  firstname: string;
  lastname: string;
  photo: string;
  role: string;
  id?: string;
}

interface IMeResponse extends IResultResponse {
  user: IUser;
}

const api = {
  refreshUser: () => {
    return axios
      .get<null, IJsonResponse<IResultResponse>>(`${BASE_URL}/users/refresh`, {
        withCredentials: true,
      })
      .then((res) => res.data);
  },

  getUser: () => {
    return axios
      .get<null, IJsonResponse<IMeResponse>>(`${BASE_URL}/users/me`, {
        withCredentials: true,
      })
      .then((res) => res.data);
  },
};
export default api;
