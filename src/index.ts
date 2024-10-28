import { helloConsumer } from './rabbitmq/consumers/hello-queue.consumer';
import { helloProducer } from './rabbitmq/producers/hello-queue.producer';

(async () => {
  await helloConsumer();
  await helloProducer();
})();
