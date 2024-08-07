export enum Role {
  admin = "admin",
  user = "user",
}

export interface TuneVaultUser {
  id: string;
  username: string;
  globalName: string;
  bot: boolean;
  createdAt: Date;
  avatar: string | null;
  activeGuildId: string | null;
  role: Role;
}
