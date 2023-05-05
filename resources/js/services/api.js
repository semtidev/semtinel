
const apiClient = axios.create({
  baseURL: "http://localhost/semtinel/public/api/",
  withCredentials: false,
});

export default apiClient;
