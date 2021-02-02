import axios from "axios";

import events from "rest/events";
import userEvents from "rest/user_events";
import ladder from "rest/ladder";
import users from "rest/users";

// Add a response interceptor
axios.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    console.log("middle ware - ", response);

    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    console.log("middle ware - ", error);
    if (error.response.status === 405) {
      //redirect to auth
      console.log("redirect to auth");
      window.location.href = `${process.env.REACT_APP_API_URL}/auth/login/google`;
    }
    return Promise.reject(error);
  }
);

const API = {
  events,
  userEvents,
  ladder,
  users,
};

export default API;
