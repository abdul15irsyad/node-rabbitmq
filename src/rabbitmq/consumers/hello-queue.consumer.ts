import amqp from 'amqplib';
import dayjs from 'dayjs';
import { delay } from '../../utils/time.util';
import { Player } from '../../data/player.data';
import { config } from 'dotenv';
config();

export const helloConsumer = async () => {
  try {
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
    await channel.assertQueue(dlQueue, {
      durable: true,
      messageTtl: 3000,
      deadLetterExchange: '',
      deadLetterRoutingKey: queue,
    });
    console.log(`[*] Waiting for messages in ${queue}. To exit press CTRL+C`);

    channel.prefetch(1);
    channel.consume(queue, async (message) => {
      try {
        if (message?.properties.type === 'greeting') {
          await delay();
          const timestamp = dayjs().format('YYYY-MM-DD HH:mm:ss');
          const payload: Player = JSON.parse(
            message?.content?.toString() ?? '{}',
          );
          if (Math.random() < 0.5)
            throw `${timestamp}: error '${payload.name}'`;
          console.log(
            `${timestamp}: hello my name is '${payload.name}', im from '${payload.team}' team and im ${payload.age} years old`,
          );
        } else {
          console.log('no type');
        }
        channel.ack(message!);
      } catch (error) {
        console.error(error);
        channel.nack(message!, false, false);
      }
    });
  } catch (error) {
    console.error(error);
  }
};
