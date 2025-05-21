import { getChannel } from "../lib/rabbitmq";
import { Product } from "../models/Product";

/**
 * Consomme l'événement "order.created" pour décrémenter le stock des produits commandés.
 */
export async function consumeOrderCreated() {
  const channel = getChannel();
  const queueName = "order.created"; // ou le nom que tu as choisi dans "orders-api"

  // Assure l'existence de la queue
  await channel.assertQueue(queueName, { durable: true });

  // Écoute la queue
  channel.consume(queueName, async (msg) => {
    if (!msg) return;

    try {
      // Le message ressemble à :
      // {
      //   "event": "order.created",
      //   "data": {
      //     "_id": "...",
      //     "clientId": "client-1234",
      //     "items": [
      //       { "productId": "p-001", "quantity": 2, "price": 8.99 },
      //       { "productId": "p-002", "quantity": 1, "price": 12.50 }
      //     ],
      //     "total": 30.48
      //   }
      // }
      const content = JSON.parse(msg.content.toString());
      console.log("📥 [products-api] Received 'order.created':", content);

      const { items } = content.data; // la liste des produits commandés
      if (Array.isArray(items)) {
        for (const item of items) {
          const product = await Product.findById(item.productId);
          if (product) {
            // Décrémente le stock
            product.stock -= item.quantity;
            await product.save();
            console.log(
              `Stock décrémenté pour le produit ${item.productId}. Nouveau stock: ${product.stock}`
            );

            // (Optionnel) Publier un event "product.stockUpdated"
            // await publishProductUpdated(product);
          }
        }
      }

      channel.ack(msg); // accuse réception
    } catch (error) {
      console.error("❌ Error processing 'order.created':", error);
      // Selon ta stratégie, tu peux renvoyer en DLQ
      channel.nack(msg, false, false);
    }
  });
}
