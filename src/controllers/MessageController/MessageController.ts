import { Request, Response } from "express";
import { isValidObjectId } from "mongoose";

import createChannel from "../../utils/createChannel";
import { Message } from "../../models/Message/Message";
import { IEmitters, TInputCreateMessage } from "./types";

class MessageController {
  async createMessage(req: Request, res: Response) {
    const { sender, receiver, text }: TInputCreateMessage = req.body;

    if (!isValidObjectId(sender) || !isValidObjectId(receiver)) {
      return res.status(400).json({ error: "The given ID'S is wrong" });
    }

    const channel = createChannel({ sender, receiver });

    try {
      const message = await Message.findOne({ channel });

      if (message && message.messages) {
        message.messages.push({ sender, text });

        const updatedMessage = await message.save();

        const { messages } = updatedMessage;

        res.status(201).json({ messages, channel });
      } else {
        const newMessage = { channel };
        await Message.create(newMessage);

        res.status(201).json({ channel });
      }
    } catch (err) {
      return res.status(500).json({ error: "Internal server error." });
    }
  }

  async getMessagesBetweenUsers(req: Request, res: Response) {
    const { sender, receiver } = req.params;

    if (!isValidObjectId(sender) || !isValidObjectId(receiver)) {
      return res.status(400).json({ error: "The given ID'S is wrong" });
    }

    const channel = createChannel({ sender, receiver });

    try {
      const messages = await Message.findOne({
        channel,
      });

      if (!messages) {
        return res.status(204).json();
      }

      const { messages: channelMessages } = messages;

      res.status(200).json({ channel, messages: channelMessages });
    } catch (err) {
      return res.status(500).json({ error: "Internal server error." });
    }
  }
}

export default MessageController;
