import { useMutation } from "@tanstack/react-query";
import type { UseMutationOptions } from "@tanstack/react-query";
import { postRequest } from "./postRequest";

export function useAppMutation<TData = unknown, TError = unknown, TVariables = { endPoint: string; payload: unknown }>(
  options?: UseMutationOptions<TData, TError, TVariables>
) {
  return useMutation({
    mutationFn: (variables: TVariables) =>
      postRequest(variables as { endPoint: string; payload: unknown }) as Promise<TData>,
    ...options,
  });
}
