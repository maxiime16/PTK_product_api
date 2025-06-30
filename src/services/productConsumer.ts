import { getChannel } from '../lib/rabbitmq.js';
import { Product } from '../models/Product.js';
import jwt from 'jsonwebtoken';

/**
 * Consomme l'événement "order.created" pour décrémenter le stock des produits commandés,
 * uniquement si le token est valide.
 */
export async function consumeOrderCreated() {
  const channel = getChannel();
  const exchange = 'orders';
  const queueName = 'products-api.order.created';

  await channel.assertExchange(exchange, 'topic', { durable: true });
  await channel.assertQueue(queueName, { durable: true });
  await channel.bindQueue(queueName, exchange, 'order.created');

  channel.consume(queueName, async (msg) => {
    if (!msg) return;

    try {
      const content = JSON.parse(msg.content.toString());

      const { token, data } = content;

      // 🔒 1. Vérification de la présence du token
      if (!token) {
        console.warn('❌ Message rejeté : token manquant');
        return channel.nack(msg, false, false);
      }

      // 🔒 2. Vérification du JWT
      if (!process.env.SERVICE_SECRET) {
        console.warn('❌ SERVICE_SECRET is not defined in environment variables');
        return channel.nack(msg, false, false);
      }
      const decoded = jwt.verify(token, process.env.SERVICE_SECRET as string);
      if (typeof decoded !== 'object' || decoded.service !== 'orders-api') {
        console.warn('❌ Message rejeté : token invalide ou service non autorisé');
        return channel.nack(msg, false, false);
      }

      // ✅ 3. Traitement du message
      const { items } = data;
      if (Array.isArray(items)) {
        for (const item of items) {
          const product = await Product.findById(item.productId);
          if (product) {
            product.stock -= item.quantity;
            await product.save();
            console.log(`✅ Stock updated for ${item.productId}`);
          }
        }
      }

      channel.ack(msg);
    } catch (error) {
      console.error('❌ Erreur lors du traitement du message :', error);
      channel.nack(msg, false, false);
    }
  });
}
