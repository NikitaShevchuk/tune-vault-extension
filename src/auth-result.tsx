import { Alert, Avatar, Button, Spinner, Typography } from "@material-tailwind/react";

import { useUser } from "src/hooks";
import { apiBaseUrl } from "./constants";

export function AuthResult() {
  const { error, isLoading, user } = useUser();

  const onLoginClick = () => window.open(`${apiBaseUrl}/auth`, "_blank");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen gap-4">
        <Spinner color="blue-gray" />
        <Typography className="text-blue-gray-100 text-xl font-bold">Loading...</Typography>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Button onClick={onLoginClick} size="sm" variant="outlined" color="white">
          Login with Discord
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-4 flex-col h-screen justify-center">
      <div className="flex items-center justify-center h-fit gap-2">
        <Avatar
          className="rounded-full w-8 h-8"
          src={`https://cdn.discordapp.com/avatars/${user?.id}/${user?.avatar}.png`}
          alt="Avatar"
          placeholder={"https://cdn.discordapp.com/embed/avatars/0.png"}
        />
        <Typography className="text-blue-gray-100 text-xl font-bold">{user?.globalName}</Typography>
        <Typography className="text-blue-gray-100 text-xl">({user?.username})</Typography>
      </div>
      <Alert color="green" className="w-fit">
        <Typography className="text-blue-gray-100 text-lg font-semibold">
          You have successfully authenticated with Discord!
        </Typography>
      </Alert>
    </div>
  );
}
