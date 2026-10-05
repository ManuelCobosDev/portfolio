---
lang: en
translationKey: orchestrator
kind: case-study
title: "Orchestrator microservice: one POST, several destinations"
seoTitle: "Orchestrator microservice: Spring Boot, Kafka, RabbitMQ"
description: "Case study: an orchestrator microservice that takes one JSON payload and routes each section to Kafka, RabbitMQ, WebClient or dynamic databases."
summary: "A single POST with a JSON payload that the orchestrator distributes across Kafka, RabbitMQ, WebClient and dynamic-connection database microservices."
stack: ["Java", "Spring Boot", "Apache Kafka", "RabbitMQ", "WebClient", "Vault"]
publishedAt: 2026-10-05
diagram: orchestrator
order: 1
draft: false
---

One of the pieces of work I am most satisfied with at Viewnext is an orchestrator microservice for a banking environment. It receives a single JSON payload through a POST request and distributes each section of the content to the microservice that must process it.

## How it works

- The orchestrator exposes a single endpoint. Whoever calls it does not need to know what is behind it.
- Each section of the JSON is routed to a specialised microservice: one publishes to **Apache Kafka**, another to **RabbitMQ**, another calls external services with **WebClient**, and another persists data in databases.
- Calls between microservices use explicit timeouts.

## The hard part: dynamic database connections

The persistence microservice does not work with a fixed database. It works with N generic databases that are only known at runtime.

- It creates the connection beans at runtime, one per database.
- It keeps connections open and reuses them, instead of opening and closing a connection on every request.
- It obtains credentials from a secrets manager (Vault), so they do not live in the service configuration.

## Design decisions

- **One destination per microservice.** It isolates the Kafka, RabbitMQ, HTTP and database dependencies and lets each one evolve separately.
- **Persistent connections versus connection per request.** It avoids the cost of opening and closing connections on every call, at the price of managing the lifecycle of the beans and of the open connections.

*I describe the design in general terms and omit system names and client data.*
