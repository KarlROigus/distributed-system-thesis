Distributed Sensor System – Thesis Project

A modular distributed system built in Rust, designed to simulate and orchestrate multiple sensor clients sending data to a centralized core service. This project serves as the implementation component of a bachelor’s/master’s thesis on distributed architectures, communication models, and concurrency in modern systems.

📌 Overview

This project consists of several independent micro-services, each running in its own Docker container:

Core – Central service that receives, validates, and stores/processes incoming data.

Client1 – A simulated sensor client that periodically generates random measurements and sends them to the core.

Client2+ – Reserved for additional experiments (load testing, fault injection, scaling).

All services are written in Rust 2021, using Tokio for async execution and Warp/Reqwest for HTTP communication.

🎯 Goal of This System

The system is designed to demonstrate:

Distributed communication patterns (client → core)

Asynchronous processing with Rust’s runtime (tokio)

Isolation of services using Docker

Fault tolerance and modularity in microservice systems

Scalability and extensibility of distributed client architectures

It provides a minimal but realistic example of building distributed applications in Rust.

🧱 Architecture
+------------+        HTTP POST        +-------------+
|  Client 1  | -----------------------> |    Core     |
| (Sensor)   |                          |  Receiver   |
+------------+                          +-------------+

+------------+
|  Client 2  |  (future extension)
+------------+

+------------+
|  Client n  |  (future extension)
+------------+


Clients generate data (e.g., random values) at a configurable interval.

Core exposes an HTTP endpoint /data.

Clients send JSON payloads to Core.

Core prints/logs/stores the data (depending on thesis experiments).

⚙️ Technologies Used
Rust

Modern system programming language emphasizing:

memory safety

zero-cost abstractions

fear-free concurrency

strong type safety

Tokio Runtime

Used for:

asynchronous HTTP server (Warp)

asynchronous HTTP client (Reqwest)

timers and periodic tasks
Tokio acts as the “event loop” that runs async tasks, similar to Node.js’s runtime — but faster and type-safe.

Warp / Reqwest

Warp → lightweight async server framework used by core

Reqwest → async HTTP client used by sensor clients

Docker

Each service is packaged in its own container. This enables:

reproducible builds

isolated dependencies

easy cross-platform execution

clean redeployment for every experiment

📂 Project Structure
.
├── core/
│   ├── Dockerfile
│   ├── Cargo.toml
│   └── src/main.rs
│
└── client1/
    ├── Dockerfile
    ├── Cargo.toml
    └── src/main.rs


Future clients can be added by duplicating the client1/ directory.

🚀 Running the System
1. Clean your environment (optional but recommended)

A helper script removes containers, images, volumes, and build cache:

./docker-clean.sh

2. Build and start all services
docker compose up --build

3. Expected Behavior

client1 generates a random number every X seconds.

It POSTs the data to core at:

http://core:3030/data


core logs the JSON payload:

Example log:

Received data: {"value": 42}

🧪 Extending the System (for your thesis experiments)

You can extend your thesis in many directions:

1. Add more sensor clients

Create new folders:

client2/
client3/
...


Each can simulate:

temperature readings

GPS coordinates

load testing patterns

failure modes

2. Store data in a database

For example:

PostgreSQL

Redis

SQLite
Add persistence and compare performance differences.

3. Introduce network failures

Study:

resilience

retries

exponential backoff

4. Add message queues

Kafka, NATS, or RabbitMQ for advanced architectures.

📈 Why Rust? (Thesis Justification)

Rust is a suitable choice for distributed systems because:

Memory-safe without garbage collection

Low runtime overhead and minimal latency

Excellent async support via tokio

Predictable performance

Modern ecosystem for networking

Compile-time guarantees prevent whole classes of failures

Compared to Node.js, Go, or Python, Rust provides:

higher throughput

fewer runtime errors

safer concurrency

deterministic resource usage

These characteristics make Rust ideal for implementing reliable distributed components.

📝 License

This project is part of a university thesis and can be reused for academic purposes.