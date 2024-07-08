import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { mutate } from "swr";

import { apiBaseUrl } from "src/constants";
import { TuneVaultUser } from "src/models";
import { HttpService } from "src/utils";

export function useUpdateUser() {
  const { trigger: updateUser, isMutating: userIsUpdating } = useSWRMutation(
    `${apiBaseUrl}/user/me`,
    async (url, { arg }: { arg: Partial<TuneVaultUser> }) => {
      const response = new HttpService()
        .post<TuneVaultUser>(url, arg)
        .then((res) => res.data);
      toast.promise(response, {
        loading: "Updating user...",
        success: "User updated",
        error: "Failed to update user",
      });
      return response;
    },
    {
      onSuccess: (data) => mutate(`${apiBaseUrl}/user/me`, data),
    },
  );
  return { updateUser, userIsUpdating };
}
