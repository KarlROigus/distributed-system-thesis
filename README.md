# Distributed System Thesis -- HTTP/2 vs HTTP/3

This repository contains the implementation and experiments for a
bachelor thesis focusing on comparing **HTTP/2** and **HTTP/3**
performance in a **distributed data aggregation system**.

The goal of this project is to measure: - **Latency** - **Fault
tolerance** - **Throughput** - **Connection behavior under load** -
**Impact of transport protocols (TCP vs QUIC)**

The project consists of **five Rust microservices**, running over either
HTTP/2 or HTTP/3 depending on the test configuration.

------------------------------------------------------------------------

## 🚀 Architecture Overview

           +-----------+        +-----------+
           | Client 1  | ---->  |           |
           +-----------+        |           |
                                |           |
           +-----------+        |   Core    | ----> Visualizer
           | Client 2  | ---->  |           |
           +-----------+        |           |
                                |           |
           +-----------+        +-----------+
           | Client 3  | ---->
           +-----------+

-   **Clients (1--3)** --- send data periodically (e.g., weather data or coefficents).
-   **Core** --- receives incoming data, aggregates (e.g., computes
    averages), and forwards results.
-   **Visualizer** --- exposes aggregated data for viewing (e.g., via
    HTTP API or dashboard).

All services run in independent containers to simulate real distributed
environments.

------------------------------------------------------------------------

## 🛠 Technologies Used

### **Rust**

-   High‑performance, memory‑safe systems programming language.
-   Ideal for microservices and protocol‑level testing.

### **Tokio**

-   Asynchronous runtime used for handling concurrent requests
    efficiently.

### **Hyper / Warp / Reqwest**

-   HTTP servers and clients.
-   Hyper supports HTTP/2 out of the box.
-   HTTP/3 is implemented via QUIC libraries such as `quinn`.

### **Docker & Docker Compose**

-   Each service runs in its own isolated container.
-   Networking is reproducible and measurable.

------------------------------------------------------------------------

## 🧪 Experiments

The system is used to test: - Client→Core latency in HTTP/2 vs HTTP/3 -
Jitter and packet loss impact - QUIC connection migration - Throughput
under simultaneous client load - Behavior during Core restarts (fault
tolerance) - Visualization of aggregated metrics

You can modify experiment parameters using environment variables or
Docker Compose settings.

------------------------------------------------------------------------

## ▶️ Running the System

Build and start all services:

``` bash
docker compose up --build
```

Stop:

``` bash
docker compose down
```

Clean data from memory:

``` bash
./docker-cleanup.sh
```

------------------------------------------------------------------------

## 📊 Output and Visualization

-   Clients send values to the Core.
-   Core aggregates (e.g., mean, rolling average).
-   Visualizer exposes `/metrics` or a small dashboard.
-   You capture timestamps at all hops to compute latency differences.


------------------------------------------------------------------------

## 🎯 Thesis Goals

The aim is to determine: - When is HTTP/3 actually better? - When does
HTTP/2 outperform HTTP/3? - How QUIC's features (0‑RTT, connection
migration) impact performance - How protocol behavior changes under
distributed load

Your thesis will analyze raw measurements collected from this system.

------------------------------------------------------------------------

## 📄 License

This project is created for academic purposes.
