import type { Config } from '~/api';
import { Server as SocketIOServer, Socket } from 'socket.io';
import http from 'http';
import * as db from '@/services/database'; // Import your database service (assumed it's named 'database' based on your structure)
import logger from 'logger'; // Import your logger
import config from 'config';
import { time } from 'console';
import { now } from '@/util';

const log = logger('SOCKET');
const server = http.createServer();
const io = new SocketIOServer(server, {
  cors: {
    origin: "*", // Allow all origins
    methods: ["GET", "POST"]
  }
});

const { port } = config.get<Config>('socket');

io.on('connection', (socket: Socket) => {
  // log.info(`A user connected: ${socket.id}`);

  // When a user joins a room
  socket.on('joinRoom', (channelId: string) => {
    socket.join(channelId);
    // log.info(`User ${socket.id} joined room: ${channelId}`);
    
    // Fetch and send existing messages from this room to the user
    getChatHistory(channelId)
      .then(messages => {
        socket.emit('chatHistory', messages);
      })
      .catch((err) => {
        log.error('Error fetching chat history:', err);
      });
  });

  // Listen for new messages
  socket.on('sendMessage', async (data: { channelId: string, message: string, type: "text" | "image" | "event", senderId: string}) => {
      const { channelId, message, senderId, type } = data;

    // Save the message to the database
    try {
      const sentAt = now();
      await saveMessageToDb(channelId, message, type, senderId, sentAt);
      io.to(channelId).emit('chatMessage', { message, senderId, type, sentAt });
      // log.info(`Message sent in room ${channelId}: ${message}`);
    } catch (err) {
      log.error('Error saving message:', err);
    }
  });

  // When a user disconnects
  socket.on('disconnect', () => {
    // log.info(`User disconnected: ${socket.id}`);
  });
});

// Function to save message to PostgreSQL database
const saveMessageToDb = async (channelId: string, message: string, type: "text" | "image" | "event", senderId: string, sentAt: number) => {
  try {
    // Assuming a function exists in your database service for saving messages
    await db.chat.insert({
      channelId,
      message,
      type,
      senderId,
      sentAt: sentAt
    });
  } catch (error) {
    throw new Error(`Error saving message to DB: ${error.message}`);
  }
};

// Function to get chat history for a specific room from PostgreSQL
const getChatHistory = async (channelId: string) => {
  try {
    // Assuming a function exists in your database service to get messages
    const messages = await db.chat.getHistoryChannelId(channelId);
    return messages; // Return the list of messages
  } catch (error) {
    throw new Error(`Error fetching chat history: ${error.message}`);
  }
};

// Start the server
server.listen(port, () => {
  log.info(`Socket.io Server started @${port}`);
});

export default io;
