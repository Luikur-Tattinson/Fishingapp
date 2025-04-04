import axiosInstance from './axiosInstance';

export const searchCatches = async ({ search, field }) => {
  const params = {};
  if (search) params.search = search;
  if (field) params.field = field;

  const response = await axiosInstance.get('http://localhost:8000/api/catches/search/', {
    params,
  });

  return response.data;
};
