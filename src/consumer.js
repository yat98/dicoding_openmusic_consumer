import amqp from 'amqplib';
import PlaylistsService from './PlaylistsService.js';
import MailSender from './MailSender.js';
import Listener from './listener.js';
import broker from './config/broker.js';

const init = async () => {
  const key = 'export:openmusic-playlists';
  const playlistsService = new PlaylistsService();
  const mailSender = new MailSender();
  const listener = new Listener(playlistsService, mailSender);

  const connection = await amqp.connect(broker.rabbitmq.server);
  const channel = await connection.createChannel();

  await channel.assertQueue(key, {
    durable: true,
  });

  channel.consume(key, listener.listen, { noAck: true });
};

init();
