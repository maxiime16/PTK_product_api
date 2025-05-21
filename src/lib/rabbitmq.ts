import * as amqplib from "amqplib";
import dotenv from "dotenv";

dotenv.config();
const RabbitMQ_URI = process.env.RabbitMQ_URI;

let connection: amqplib.ChannelModel | null = null;
let channel: amqplib.Channel | null = null;

export async function connectRabbitMQ() {
  try {
    if (!RabbitMQ_URI) {
      throw new Error(
        "RabbitMQ_URI is not defined in the environment variables."
      );
    }
    connection = await amqplib.connect(RabbitMQ_URI);
    if (connection) {
      channel = await connection.createChannel();
      console.log("🟢 2/2 - Connected to RabbitMQ");
    } else {
      console.error("❌ Failed to connect: connection is null");
      process.exit(1);
    }
  } catch (error) {
    console.error("❌ Failed to connect to RabbitMQ", error);
    process.exit(1);
  }
}

export function getChannel(): amqplib.Channel {
  if (!channel) {
    throw new Error(
      "RabbitMQ channel not initialized. Call connectRabbitMQ first."
    );
  }
  return channel;
}
