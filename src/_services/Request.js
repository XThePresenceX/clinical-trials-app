import Config from "react-native-config";

const getHeaders = () => {
  return {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: Config.AUTHORIZATION_TOKEN,
    apiKey: Config.API_KEY
  };
};

module.exports.getRequest = async url => {
  console.log(url);
  let options = {
    method: "GET",
    headers: getHeaders()
  };
  let response = await fetch(Config.API_URL + url, options);
  return await response.json();
};

module.exports.postRequest = async (url, body) => {
  let options = {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(body)
  };
  let response = await fetch(Config.API_URL + url, options);
  return await response.json();
};

module.exports.putRequest = async (url, body) => {
  let options = {
    method: "PUT",
    headers: getHeaders(),
    body: JSON.stringify(body)
  };
  let response = await fetch(Config.API_URL + url, options);
  return await response.json();
};

module.exports.deleteRequest = async (url, body = {}) => {
  let options = {
    method: "DELETE",
    headers: getHeaders(),
    body: JSON.stringify(body)
  };
  let response = await fetch(Config.API_URL + url, options);
  return await response.json();
};
