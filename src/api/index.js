import axios from "axios";
export default function request(config) {
  const instance = axios.create({
    baseURL: "http://服务器地址:9999",
    timeout: 3000,
  });
  instance.interceptors.request.use(
    (config) => {
      let token = JSON.parse(localStorage.getItem("backToken"));
      if (token) {
        config.headers.Authorization = `Bearer ${token.token}`;
      }
      return config;
    },
    (err) => {
      return Promise.reject(err);
    }
  );
  instance.interceptors.response.use(
    (res) => {
      return res;
    },
    (err) => {
      console.log(err);
    }
  );
  return instance(config);
}
