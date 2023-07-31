import { model, Schema, Document } from "mongoose";
import { IMessage } from "./types";

const messageSchema = new Schema<IMessage>({
  channel: { type: String, required: true, unique: true },
  messages: { type: Array, default: [] },
  createdAt: { type: Date, default: new Date() },
});

export const Message = model<IMessage>("Message", messageSchema);
