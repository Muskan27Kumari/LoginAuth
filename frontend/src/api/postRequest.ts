import client from "./axios.config";

export const postRequest = async <T = unknown>(body: {
  endPoint: string;
  payload: unknown;
}): Promise<T> => {
  const response = await client.post<T>(body.endPoint, body.payload);
  return response.data;
};
