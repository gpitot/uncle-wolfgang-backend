//export const BASE_URL = "https://north-manly-squash.herokuapp.com/api";
export const BASE_URL = `${process.env.REACT_APP_API_URL}/api`;
export interface IJsonResponse<T> {
  data: T;
}

export interface IResultResponse {
  success: boolean;
  err? : string;
}

export const commonAxiosConfig = {
  headers: { "Content-Type": "application/json" },
};
