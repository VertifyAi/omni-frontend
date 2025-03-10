import { SignInResponse } from "@/lib/definitions";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export const post = async (
  url: string,
  body: Record<string, unknown>,
  options?: RequestInit
): Promise<{ data: SignInResponse; response: Response }> => {
  const response = await fetch(
    "http://localhost:3001/" + url,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      ...options,
    }
  );
  const data = await response.json();
  return { data, response } as { data: SignInResponse; response: Response };
};

export const get = async <T>(url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    method: "GET",
    ...options,
  });
  const data = await response.json();
  return data as T;
};

export const put = async <T>(
  url: string,
  body: Record<string, unknown>,
  options?: RequestInit
) => {
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
    ...options,
  });
  const data = await response.json();
  return data as T;
};

export const del = async <T>(url: string, options?: RequestInit) => {
  const response = await fetch(url, {
    method: "DELETE",
    ...options,
  });
  const data = await response.json();
  return data as T;
};

export async function fetchApi(path: string, options?: RequestInit) {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  console.log(response);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}
