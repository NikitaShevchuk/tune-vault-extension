import useSWR from "swr";

import { HttpService } from "src/utils";
import { apiBaseUrl } from "src/constants";
import { User } from "src/models";

export function useUser() {
  const { data, isLoading, error } = useSWR(
    `${apiBaseUrl}/auth/me`,
    (url) => new HttpService().get<User>(url),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      errorRetryInterval: 1000,
    },
  );

  const user = data?.data;
  const response = data;

  return { user, isLoading, error, response };
}
