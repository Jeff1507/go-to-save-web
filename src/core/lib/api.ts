import ky, { isHTTPError } from "ky";

export const API_BASE_URL = "http://localhost:8080";

export const api = ky.create({
  prefix: `${API_BASE_URL}/store/`,
  retry: 2,
  timeout: 10000,
  credentials: "include",
  hooks: {
    afterResponse: [
      async ({ response }) => {
        const dataOnResponses = [200, 201];
        if (!dataOnResponses.includes(response.status)) return response;

        const contentType = response.headers.get("content-type");
        if (!contentType?.includes("application/json")) return response;

        const wrappedData = await response.json<ApiResponse>();

        const data = wrappedData.data;

        return new Response(JSON.stringify(data), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
        });
      },
    ],

    beforeError: [
      async ({ error }) => {
        if (isHTTPError(error) && error.data !== undefined) {
          const body = error.data as {
            error?: string;
            errors?: Record<string, string>;
          };

          if (body.errors) {
            error.message =
              "Dados inválidos. Verifique as informações e tente novamente.";
          } else if (body.error) {
            error.message = body.error;
          }
        }

        return error;
      },
    ],
  },
});

type ApiResponse<T = unknown> = {
  data: T;
};
