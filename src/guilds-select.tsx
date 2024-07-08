import React from "react";
import { Select, Option, Typography, Avatar } from "@material-tailwind/react";

import { useDiscordGuilds, useUpdateUser, useUser } from "src/hooks";

export function GuildsSelect() {
  const [selectedGuildId, setSelectedGuildId] = React.useState<
    string | undefined
  >(undefined);
  const defaultGuildIdAlreadySetRef = React.useRef(false);

  const { isLoading, guilds } = useDiscordGuilds();
  const { user, isLoading: userIsLoading } = useUser();
  const { updateUser, userIsUpdating } = useUpdateUser();

  const userId = user?.id;
  React.useEffect(() => {
    const selectedGuildIdIsDifferent = selectedGuildId !== user?.activeGuildId;
    if (userId && selectedGuildId && selectedGuildIdIsDifferent) {
      updateUser({ activeGuildId: selectedGuildId });
    }
  }, [userId, selectedGuildId, user?.activeGuildId]);

  React.useEffect(() => {
    if (
      user?.activeGuildId &&
      !userIsLoading &&
      !defaultGuildIdAlreadySetRef.current
    ) {
      setSelectedGuildId(user.activeGuildId);
      defaultGuildIdAlreadySetRef.current = true;
    }
  }, [userIsLoading, user?.activeGuildId]);

  if (isLoading) {
    return <Typography color="gray">Loading guilds...</Typography>;
  }

  return (
    <Select
      label="Active Server"
      disabled={isLoading || userIsUpdating || userIsLoading}
      value={selectedGuildId}
      onChange={(e) => setSelectedGuildId(e)}
      color="blue-gray"
      className="text-blue-gray-100"
      labelProps={{
        className: "text-blue-gray-100",
      }}
    >
      {guilds ? (
        guilds?.map(({ id, name, icon }) => (
          <Option key={id} value={id} className="gap-3 flex items-center">
            <Avatar
              className="w-5 h-5"
              src={
                icon
                  ? `https://cdn.discordapp.com/icons/${id}/${icon}.png`
                  : "https://cdn.discordapp.com/embed/avatars/0.png"
              }
              placeholder="https://cdn.discordapp.com/embed/avatars/0.png"
            />
            {name}
          </Option>
        ))
      ) : (
        <Option value="no-guilds">No guilds</Option>
      )}
    </Select>
  );
}
