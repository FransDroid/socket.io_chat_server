# Socket.IO Chat Application with Persistent PostgreSQL Database

This repository contains a Node.js application built with Express and Socket.IO that enables real-time chat functionality. Messages exchanged in the chat are stored in a PostgreSQL database to provide persistence. This README will guide you through setting up and running the application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Usage](#usage)
- [License](#license)

## Prerequisites

Before running this application, ensure you have the following prerequisites installed:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- PostgreSQL: [Download and Install PostgreSQL](https://www.postgresql.org/download/)

## Installation

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/FransDroid/socket.io_chat_server.git
   cd socket.io_chat_server

2. Initialize the project and install the required Node.js dependencies:

 ```bash
   npm init
   npm install socket.io express nodemon pg dotenv
```

3. Configuration
Create a .env file in the project root directory and add the following environment variables with appropriate values:
```bash
DB_HOST=your_postgresql_host
DB_NAME=your_database_name
DB_USER=your_database_user
DB_PASSWORD=your_database_password
PORT=your_preferred_port
```
Configure your PostgreSQL database. Ensure that a database with the specified name (DB_NAME) exists, and the provided user (DB_USER) has the necessary permissions to access it.

Usage
Start the application using nodemon to automatically restart the server on code changes:

```bash
npm run start
```
The server will start and listen on the port specified in your .env file (PORT).

Access the chat application in your web browser by navigating to http://localhost:your_preferred_port. 
You can open multiple browser tabs to simulate different users and test the real-time chat.

Use the application to send and receive chat messages. Messages will be persisted in the PostgreSQL database and retrieved when users reconnect to the chat.

To access the PostgreSQL database to view the stored messages, you can use a PostgreSQL client or command-line tools.
