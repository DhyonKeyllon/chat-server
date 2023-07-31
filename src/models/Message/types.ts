export type TMessage = {
  sender: string;
  text: string;
};

export interface IMessage extends Document {
  channel: string;
  messages?: TMessage[];
  createdAt: Date;
}
