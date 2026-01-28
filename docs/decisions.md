# H-OS – Technical Decisions

## Databases

### PostgreSQL (Primary Database)
Used for:
- Patients
- Staff
- Appointments
- Beds
- Inventory

Reason:
- Strong relational integrity
- ACID compliance
- Complex queries & joins

### MongoDB (Secondary Database)
Used for:
- Notification logs
- Event data

Reason:
- Flexible schema
- Write-heavy workloads
- Easy event storage

### Redis (Cache)
Used for:
- Slot availability
- Staff availability
- Frequently accessed data

Reason:
- In-memory speed
- TTL support

## Database Drivers & Libraries

| Purpose        | Technology | Library     |
|----------------|------------|-------------|
| PostgreSQL     | SQL        | pg + Prisma |
| MongoDB        | NoSQL      | mongoose    |
| Redis          | Cache      | ioredis     |
| Message Queue  | RabbitMQ   | amqplib     |

## Service → Database Mapping

- Patient Service → PostgreSQL + Redis
- Staff Service → PostgreSQL + Redis
- Notification Service → MongoDB
- API Gateway → No database
