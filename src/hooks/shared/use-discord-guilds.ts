import useSWR from "swr";
import React from "react";
import { Guild } from "discord.js";

import { HttpService } from "src/utils";
import { getCookie } from "src/utils";
import { apiBaseUrl } from "src/constants";
import { TuneVaultGuild } from "src/models";

const emptyArray: string[] = [];

export function useDiscordGuilds() {
  const [discordGuildsIds, setDiscordGuildsIds] =
    React.useState<string[]>(emptyArray);

  const { data: discordGuildsResponse } = useSWR(
    `https://discord.com/api/users/@me/guilds`,
    (url) =>
      new HttpService().get<Guild[]>(url, {
        headers: {
          Authorization: `Bearer ${getCookie("discord-token")}`,
        },
      }),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
    },
  );

  const {
    data: tuneVaultGuildsResponse,
    isLoading,
    error,
  } = useSWR(
    `${apiBaseUrl}/discord/guild?ids=${discordGuildsIds.join(",")}`,
    (url) => new HttpService().get<TuneVaultGuild[]>(url),
    {
      revalidateOnFocus: true,
      shouldRetryOnError: true,
      errorRetryInterval: 5000,
      query: {
        ids: discordGuildsIds,
      },
    },
  );
  const guilds = tuneVaultGuildsResponse?.data;
  const response = tuneVaultGuildsResponse;

  React.useEffect(() => {
    if (!discordGuildsResponse) {
      setDiscordGuildsIds(emptyArray);
      return;
    }
    const arrayHasChanged = discordGuildsResponse.data.some(
      (guild) => !discordGuildsIds?.some((id) => id === guild.id),
    );
    if (!arrayHasChanged) {
      return;
    }
    setDiscordGuildsIds(discordGuildsResponse.data.map((guild) => guild.id));
  }, [discordGuildsResponse]);

  return { guilds, isLoading, error, response };
}
