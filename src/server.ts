import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { join } from 'path';
import { Server } from 'socket.io';
import { createServer } from 'http';

// init express app
const port = 5000;
const app: Application = express();

const server = createServer(app);

//init socket.io server
const io = new Server(server);

// cookie Parser setup
app.use(cookieParser());

// Cors setup
app.use(cors({
  origin: `http://localhost:5000`,
  credentials: true,
}));

// telling express to use json
app.use(express.json());

// page html messagerie
app.get('/', ( req: Request, res: Response) => {
  res.status(200).sendFile(join(__dirname + '/html/index.html'));
});

let user_count = 0;

// socket.io connection
io.on('connection', (socket) => {
  user_count++;
  socket.on('disconnect', () => {
    user_count--;
    socket.emit('user_count', user_count);
  });
  //user counter
  socket.emit('user_count', user_count);
  socket.on('user_count', () => {
    socket.emit('user_count', user_count);
  });

  //hi message
  socket.on('hi', (username) => {
    io.emit('hi', username);
  });

  //bye message
  socket.on('bye', (username) => {
    io.emit('bye', username);
  });

  // chat message
  socket.on('chat message', (username, msg) => {
    io.emit('chat message',username, msg);
  });
});

server.listen(port, () => {
  console.log(`Your API is now listening on port ${port}`);
});
