import axios from "axios";
export default function request(config) {
  const instance = axios.create({
    timeout: 5000,
  });
  instance.interceptors.request.use(
    (config) => {
      let simpleToken = JSON.parse(localStorage.getItem("simpleToken"));
      if (simpleToken) {
        config.headers.Authorization = `Bearer ${simpleToken.token}`;
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
