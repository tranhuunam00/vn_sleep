import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { chatBotSleepWithLangChain } from 'src/common/util/langchain';

const rooms: { name: string }[] = [];

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket): void {
    console.log(`Client ${client.id} connected`);
    client.join(`${client.id}__botChat`);
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, room: { name: string }): void {
    const index = rooms.findIndex((r) => r.name === room.name);
    if (index > -1) {
      rooms[index] === room;
    } else {
      rooms.push(room);
    }
    client.join(room.name);
    this.server
      .to(room.name)
      .emit('userJoined', `${client.id} has joined the room ${room.name}`);
  }

  @SubscribeMessage('chatBot')
  async handleMessage(client: Socket, data: any) {
    const { message } = data;
    const roomName = `${client.id}__botChat`;
    console.log(message);
    const dataReturn = await chatBotSleepWithLangChain(message);
    this.server.to(roomName).emit('newChatBotMessage', dataReturn);
  }
}
