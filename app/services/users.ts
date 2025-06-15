export interface User {
  login: string;
  email: string;
  role: string;
  id: string;
  created_at: string;
  last_login_date: string | null;
  disabled: boolean;
  deleted: boolean;
}

export interface FetchUsersResponse {
  users: User[];
  total_users: number;
  total_pages: number;
  current_page: number;
}
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const fetchUsers = async (
  page: number = 1,
  size: number = 10
): Promise<FetchUsersResponse> => {
  await sleep(1000); // Sleep for 1 second

  const url = `http://127.0.0.1:8000/admin/users?page=${page}&size=${size}`;
  const headers = {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVc2VyIiwicm9sZSI6ImFkbWluIiwiZXhwIjoxNzQ5OTA2Mjg4fQ.sIlESn-ge-7Z5D0lNu9BINDT6GCZVV0Au7x4xcsC0RU",
  };
  const response = await fetch(url, { headers });
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};
