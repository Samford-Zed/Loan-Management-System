import axios from "axios";

const publicApi = axios.create({
  baseURL: "http://localhost:8081",
});

export default publicApi;
