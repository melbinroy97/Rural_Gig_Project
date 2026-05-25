const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(helmet());
app.use(morgan('dev'));

// Apply rate limiter to v1 endpoints
app.use('/api/', limiter);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Pass io to request object
app.use((req, res, next) => {
  req.io = io;
  next();
});

// Active online users tracking
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  // Setup user and broadcast online state
  socket.on('setup', (userData) => {
    if (userData && userData._id) {
      socket.join(userData._id);
      onlineUsers.set(userData._id.toString(), socket.id);
      io.emit('user status update', Array.from(onlineUsers.keys()));
      socket.emit('connected');
    }
  });

  // Join a messaging chat room
  socket.on('join chat', (room) => {
    socket.join(room);
    console.log(`User joined room: ${room}`);
  });

  // Typing indicators
  socket.on('typing', (room) => socket.in(room).emit('typing', room));
  socket.on('stop typing', (room) => socket.in(room).emit('stop typing', room));

  // Broadcast new messages
  socket.on('new message', (newMessageReceived) => {
    const chatRoom = newMessageReceived.conversationId;
    socket.in(chatRoom).emit('message received', newMessageReceived);
  });

  // Offline status broadcasts
  socket.on('disconnect', () => {
    for (let [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('user status update', Array.from(onlineUsers.keys()));
        console.log(`User offline: ${userId}`);
        break;
      }
    }
    console.log(`Socket disconnected: ${socket.id}`);
  });
});

// Routes mounted with v1 versioning prefix
app.use('/api/v1/auth', require('./routes/authRoutes'));
app.use('/api/v1/users', require('./routes/userRoutes'));
app.use('/api/v1/gigs', require('./routes/gigRoutes'));
app.use('/api/v1/jobs', require('./routes/jobRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes'));
app.use('/api/v1/reviews', require('./routes/reviewRoutes'));
app.use('/api/v1/messages', require('./routes/messageRoutes'));

app.get('/', (req, res) => {
  res.send('RuralConnect API is running...');
});

// Centered central error interceptor
app.use(errorHandler);

const PORT = process.env.PORT || 2000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
