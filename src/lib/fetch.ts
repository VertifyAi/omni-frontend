import { SignInResponse } from "@/lib/definitions";

export const post = async (
  url: string,
  body: Record<string, unknown>,
  options?: RequestInit
): Promise<{ data: SignInResponse; response: Response }> => {
  const response = await fetch(
    "https://api.vertify.com.br/" + url,
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
