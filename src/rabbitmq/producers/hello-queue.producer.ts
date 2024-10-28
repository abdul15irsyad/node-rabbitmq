import amqp from 'amqplib';
import { players } from '../../data/player.data';
import { config } from 'dotenv';
config();

export const helloProducer = async () => {
  const queue = 'hello-queue';
  const dlQueue = 'hello-dlqueue';
  const connection = await amqp.connect(
    process.env.RABBITMQ_URL ?? 'amqp://guest:guest@localhost:5672',
  );
  const channel = await connection.createChannel();

  await channel.assertQueue(queue, {
    durable: true,
    deadLetterExchange: '',
    deadLetterRoutingKey: dlQueue,
  });

  for (const player of players) {
    channel.publish('', queue, Buffer.from(JSON.stringify(player)), {
      persistent: true,
      type: 'greeting',
    });
  }
};
