const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { Pool } = require("pg");
require('dotenv').config();

const app = express();
const httpServer = createServer(app);
const io =  new Server(httpServer);
const dbHost = process.env.DB_HOST;
const dbName = process.env.DB_NAME;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const port = process.env.PORT;


const pool = new Pool({
  user: dbUser,
  host: dbHost,
  database: dbName,
  password: dbPassword,
  port: 5432, // Default PostgreSQL port
});


io.on("connection", async (socket)=>{
  socket.join("user_group");
  console.log(socket.id, "backend connected");

  let client = await connectToDB();


    if (!client) {
      // Attempt to reconnect to the database
      client = await connectToDB();
    }

    if (client) {
      getRecentMessages(client, 50);
    }
    
    socket.on("sendMsg", async (msg) =>{

      if (!client) {
        // Attempt to reconnect to the database
        client = await connectToDB();
      }
  
      if (client) {
        handleMessage(msg, client);
      }
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected");

      // Release the client connection on disconnection
      if (client) {
        client.release();
        client = null;
      }
    });

    // Handle the "reconnected" event
    socket.on("reconnected", () => {
      // Rejoin the client to the chat room
      socket.join("user_group");
      console.log("Client has reconnected");
    });
});

const connectToDB = async () => {
  try {
    const client = await pool.connect();
    return client;
  } catch (err) {
    console.error("Error connecting to the database:", err);
    return null;
  }
};

const handleMessage = async (msg, client) => {
  //console.log("msg", msg);
  try {
    // Save the message to the database
    const insertQuery =
      "INSERT INTO chat_messages (userid ,sender, message, type ,timestamp) VALUES ($1, $2, $3, $4, $5)";
    const values = [msg.userid, msg.sender, msg.message, msg.type, msg.timestamp];
    try {
      await client.query(insertQuery, values);
    } catch (err) {
      console.error("Error saving message to the database:", err);
    }

    // Emit the new message to all clients in the "user_group" room
    //io.to("user_group").emit("sendMsgServer", [msg]);
    getRecentMessages(client, 50);
  } catch (err) {
    console.error("Error saving or emitting message:", err);
  }
};

const getMessages = async (client) => {
  try {
    // Retrieve previous chat messages from the database
    const messagesQuery = "SELECT * FROM chat_messages";
    const result = await client.query(messagesQuery);
    const messages = result.rows;
    //console.log(messages);
    io.to("user_group").emit("sendMsgServer", messages);
  } catch (err) {
      console.error("Error fetching messages:", err);
      return [];
    }
};

// Modify your "getMessages" function to send a limited number of recent messages
const getRecentMessages = async (client, limit) => {
  try {
    const messagesQuery = "SELECT * FROM chat_messages ORDER BY timestamp DESC LIMIT $1";
    const result = await client.query(messagesQuery, [limit]);
    const messages = result.rows;
    console.log(messages[1]);
    io.to("user_group").emit("recentMessages", messages);
  } catch (err) {
    console.error("Error fetching recent messages:", err);
    return [];
  }
};

httpServer.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});