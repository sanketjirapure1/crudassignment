import axios from "axios";

const BASE_URL =
  "https://crudcrud.com/api/1826bbf098b648418472421c474c7ca1/members";

export const fetchAllMembers = () => axios.get(BASE_URL);
export const fetchMemberById = (id) => axios.get(`${BASE_URL}/${id}`);
export const createMember = (member) => axios.post(BASE_URL, member);
export const updateMember = (id, member) =>
  axios.put(`${BASE_URL}/${id}`, member);
export const deleteMember = (id) => axios.delete(`${BASE_URL}/${id}`);
