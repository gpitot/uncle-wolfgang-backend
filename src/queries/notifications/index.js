import fetch from "node-fetch";
import FormData from "form-data";

const addAdminNotification = (message) => {
  try {
    const url =
      "https://docs.google.com/forms/u/1/d/e/1FAIpQLScFKlUumzr2EpfTbaDkTCUjpCBJncA517n7afQDf-xoVaG3Vg/formResponse";
    const formData = new FormData();

    formData.append("entry.1745826593", Date.now());
    formData.append("entry.860934272", message);

    fetch(url, { method: "post", body: formData });
  } catch (err) {
    return;
  }
};

export { addAdminNotification };
