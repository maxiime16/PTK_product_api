## Créer les .env:

### 1/ .env

```
MONGODB_PRODUCT_URI=mongodb://mspr:mspr@localhost:27017/products_db?authSource=admin
RabbitMQ_URI=amqp://mspr:mspr@localhost:5672
PORT_CLIENT=3003
JWT_SECRET=mySuperSecretForMSPR
```

### 2/ .env.docker

```
MONGODB_PRODUCT_URI=mongodb://mspr:mspr@payetonkawa-mongo:27017/products_db?authSource=admin
RabbitMQ_URI=amqp://mspr:mspr@payetonkawa-rabbitmq:5672
PORT_CLIENT=3003
JWT_SECRET=mySuperSecretForMSPR
```
