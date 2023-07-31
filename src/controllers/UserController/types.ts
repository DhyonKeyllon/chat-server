import { IUser } from "../../models/User/types";

export type TSignupInput = Pick<IUser, "name" | "email" | "password">;

export type TSigninInput = Pick<IUser, "email" | "password">;

export type TUpdateUserInput = Pick<IUser, "name" | "email" | "id">;

export type TUserData = Pick<IUser, "name" | "email" | "id">;

export type TUserDataResponse = {
  user: TUserData;
};

export type TUsersDataResponse = {
  users: TUserData[];
};

export type TSignResponse = {
  user: TUserDataResponse;
  token: string;
};

export type TGetUsersResponse = {
  users: TUserDataResponse[];
};

export type TGetUserByTokenInput = {
  token: string;
};

export type TGetUserByIdInput = {
  id: string;
};

export type TDeleteUserResponse = {
  message: string;
};
