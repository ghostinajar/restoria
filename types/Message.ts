// message
interface IMessage {
  type: string;
  content: string | Array<string>;
}

export interface IMessagePack {
  agentUsername?: string;
  targetUsername?: string;
  observerUsernames?: Array<string>;
  messageForAgent?: IMessage;
  messageForTarget?: IMessage;
  messageForObservers?: IMessage;
}

export default IMessage;
