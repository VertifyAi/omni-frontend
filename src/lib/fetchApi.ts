import Cookies from "js-cookie"

export async function fetchApi(
  input: RequestInfo,
  options: RequestInit = {}
): Promise<Response> {
  const token = Cookies.get("auth_token");

  const headers = new Headers(options.headers || {});

  // Define Content-Type como application/json se não tiver
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Adiciona Authorization se o token existir
  if (token) {
    headers.set(
      "Authorization",
      `Bearer ${token}`
    );
  }

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(input, finalOptions);

  return response;
}
