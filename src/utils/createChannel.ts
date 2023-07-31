type TCreateChannel = {
  sender: string;
  receiver: string;
};

function createChannel({ sender, receiver }: TCreateChannel): string {
  const sortedIds = [sender, receiver].sort();
  return sortedIds.join("-");
}

export default createChannel;
