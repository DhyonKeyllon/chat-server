import { IMessage } from "../../models/Message/types";

export type TMessageData = Pick<IMessage, "channel" | "messages">;

export type IEmitters = {
  sender: string;
  receiver: string;
};

export type TInputCreateMessage = {
  text: string;
} & IEmitters;
