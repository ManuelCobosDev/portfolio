---
lang: es
translationKey: orchestrator
kind: case-study
title: 'Microservicio orquestador: un único POST, varios destinos'
seoTitle: 'Microservicio orquestador: Spring Boot, Kafka, RabbitMQ'
description: 'Caso de estudio: un microservicio orquestador que recibe un JSON y enruta cada sección a Kafka, RabbitMQ, WebClient o bases de datos dinámicas.'
summary: 'Un único POST con un JSON que el orquestador reparte entre microservicios de Kafka, RabbitMQ, WebClient y bases de datos con conexión dinámica.'
stack: ['Java', 'Spring Boot', 'Apache Kafka', 'RabbitMQ', 'WebClient', 'Vault']
publishedAt: 2026-10-05
diagram: orchestrator
order: 1
draft: false
---

Uno de los trabajos de los que estoy más satisfecho en Viewnext es un microservicio orquestador para un entorno bancario. Recibe un único JSON por POST y reparte cada sección del contenido al microservicio que debe procesarla.

## Cómo funciona

- El orquestador expone un único endpoint. Quien lo invoca no necesita saber qué hay detrás.
- Cada sección del JSON se enruta a un microservicio especializado: uno publica en **Apache Kafka**, otro en **RabbitMQ**, otro llama a servicios externos con **WebClient** y otro persiste datos en bases de datos.
- Las llamadas entre microservicios usan timeouts explícitos.

## La parte difícil: conexiones dinámicas a bases de datos

El microservicio de persistencia no trabaja con una base de datos fija, sino con N bases de datos genéricas que se conocen en tiempo de ejecución.

- Crea los beans de conexión en tiempo de ejecución, uno por cada base de datos.
- Mantiene las conexiones abiertas y las reutiliza, en lugar de abrir y cerrar una conexión en cada petición.
- Obtiene las credenciales de un gestor de secretos (Vault), de modo que no viven en la configuración del servicio.

## Decisiones de diseño

- **Un destino por microservicio.** Separa las dependencias de Kafka, RabbitMQ, HTTP y base de datos, y permite evolucionar cada una por separado.
- **Conexiones persistentes frente a conexión por petición.** Se evita el coste de abrir y cerrar conexiones en cada llamada, a cambio de gestionar el ciclo de vida de los beans y de las conexiones abiertas.

_Describo el diseño en términos generales y omito nombres de sistemas y datos del cliente._
