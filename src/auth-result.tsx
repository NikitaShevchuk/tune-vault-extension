import React from "react";
import { Avatar, Button, Spinner, Typography } from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";

import { useUser } from "src/hooks";
import { apiBaseUrl, appUrl } from "src/constants";
import { GuildsSelect } from "src/guilds-select";

export function AuthResult() {
  const { error, isLoading, user } = useUser();

  const onLoginClick = () => window.open(`${apiBaseUrl}/auth`, "_blank");

  React.useEffect(updateCookies, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen gap-4">
        <Spinner color="blue-gray" />
        <Typography className="text-blue-gray-100 text-xl font-bold">
          Loading...
        </Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Button
          onClick={onLoginClick}
          size="sm"
          variant="outlined"
          color="white"
        >
          Login with Discord
        </Button>
      </div>
    );
  }

  return (
    <div className="flex w-full items-center gap-4 flex-col h-screen justify-center">
      <div className="flex w-full ltems-center justify-center flex-col h-fit gap-5">
        <div className="flex items-center justify-center h-fit gap-2">
          <Avatar
            className="rounded-full w-5 h-5"
            src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`}
            alt="Avatar"
            placeholder={"https://cdn.discordapp.com/embed/avatars/0.png"}
          />
          <Typography className="text-blue-gray-100 text-md font-bold">
            {user?.globalName}
          </Typography>
          <Typography className="text-blue-gray-100 text-md">
            ({user?.username})
          </Typography>
        </div>

        <GuildsSelect />
        <div className="flex w-full justify-center items-center gap-1">
          <InformationCircleIcon className="text-blue-gray-100 w-4 h-3" />
          <Typography className="text-blue-gray-100 text-md">
            Select a server to play music
          </Typography>
        </div>
      </div>
    </div>
  );
}

function updateCookies() {
  setTokenFromPageToCookies("token");
  setTokenFromPageToCookies("discord-token");
}

function setTokenFromPageToCookies(name: string) {
  chrome.cookies?.get({ url: appUrl, name }, (cookie) => {
    if (!cookie) {
      return;
    }
    const token = cookie.value;

    const tenDays = 864_000;
    document.cookie = `${name}=${token};path=/;max-age=${tenDays};`;
  });
}
