
const apiClient = axios.create({
  baseURL: "http://localhost/semtinel/api/",
  withCredentials: false,
});

export default apiClient;
