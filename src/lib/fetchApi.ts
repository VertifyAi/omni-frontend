// import Cookies from "js-cookie"

export async function fetchApi(
  input: RequestInfo,
  options: RequestInit = {}
): Promise<Response> {
  // Lê o token do cookie (se existir)
  // const token = Cookies.get("Authorization")

  const headers = new Headers(options.headers || {});

  // Define Content-Type como application/json se não tiver
  if (!headers.has("Content-Type") && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  // Adiciona Authorization se o token existir
  // if (token) {
    headers.set(
      "Authorization",
      `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwibmFtZSI6Ikpvw6NvIFBlcmV0dGkiLCJlbWFpbCI6ImpvYW9wZXJldHRpQHZlcnRpZnkuY29tLmJyIiwicm9sZSI6IkFETUlOIiwic3RyZWV0TmFtZSI6IiIsInN0cmVldE51bWJlciI6IiIsImNpdHkiOiJKYcO6Iiwic3RhdGUiOiJTw6NvIFBhdWxvIiwicGhvbmUiOiI1NTE0OTk4MzI4MTA3IiwiYXJlYUlkIjowLCJjb21wYW55SWQiOjIsImlhdCI6MTc0NTg4NzU2NywiZXhwIjoxNzQ1OTAxOTY3fQ.QqPlyxS5LGs1-tbHekLwIGoeE-M-_948KZC5jMNJoYA`
    );
  // }

  const finalOptions: RequestInit = {
    ...options,
    headers,
  };

  const response = await fetch(input, finalOptions);

  return response;
}
