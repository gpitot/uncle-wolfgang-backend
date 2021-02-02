import axios from "axios";
import {
  IJsonResponse,
  BASE_URL,
  commonAxiosConfig,
  IResultResponse,
} from "rest/common";

export interface IEvent {
  description: string;
  enabled: boolean;
  id: number;
  name: string;
  open: string;
  spots: number;
  start: string;
}

interface IEventsResponse extends IResultResponse {
  result: Array<IEvent>;
}

interface IEventResponse extends IResultResponse {
  result: IEvent;
}

const api = {
  getEvent: (id: string) => {
    return axios
      .get<null, IJsonResponse<IEventResponse>>(`${BASE_URL}/events/${id}`)
      .then((res) => {
        return res.data;
      });
  },

  getEvents: () => {
    return axios
      .get<null, IJsonResponse<IEventsResponse>>(`${BASE_URL}/events`)
      .then((res) => {
        return res.data;
      });
  },

  editEvent: (event: IEvent) => {
    return axios
      .put<null, IJsonResponse<IEventsResponse>>(
        `${BASE_URL}/events`,
        event,
        commonAxiosConfig
      )
      .then((res) => {
        return res.data;
      });
  },

  addEvent: (event: Omit<IEvent, "id">) => {
    return axios
      .post<null, IJsonResponse<IEventsResponse>>(
        `${BASE_URL}/events`,
        event,
        commonAxiosConfig
      )
      .then((res) => {
        return res.data;
      });
  },
};

export default api;
