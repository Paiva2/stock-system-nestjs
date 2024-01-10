# Stock System - NestJS

## Overview

This NestJS-based Stock System provides a comprehensive set of functionalities for managing stocks, items, categories, and user profiles. Users can register, login, change passwords, and perform various actions related to stock management.

## Users should are able to:

- Authentication: Users can register, login, and change passwords.

- Profile Management: Access and modify user profile information.

- Stock Operations: Create, edit, and filter stocks.

- Item Management: Add, remove, edit, and list items within a stock.

- Category Operations: Create, delete, edit, and filter categories.

- Pre-built Item Handling: Create, edit, remove, and filter pre-built items.

## Technologies

- TypeScript
- Node
- Express
- NestJS
- Prisma (Postgres)
- Docker
- Vitest

## Installation guide

```
bash

$ git clone https://github.com/Paiva2/stock-system-nestjs.git

$ cd stock-system-nestjs

$ npm install

.env environment configuration

$ docker compose up

$ npx prisma migrate deploy

$ npm run dev

```
