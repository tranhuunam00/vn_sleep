import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import axios from 'axios';
import { Server, Socket } from 'socket.io';

const rooms: { name: string }[] = [];

@WebSocketGateway({ transports: ['websocket'] })
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
    console.log('[chatBot] data:', data);

    const { message } = data;

    console.log('----chatBot----');
    const roomName = `${client.id}__botChat`;

    try {
      const payload = {
        question: message,
        top_k: 8,
      };

      console.log('payload', payload);

      const response = await axios.post(
        'http://222.255.214.218:8000/answer',
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
          },
          timeout: 20000,
        },
      );

      const dataReturn = response.data;

      console.log(' [chatBot]  dataReturn', dataReturn);

      this.server
        .to(roomName)
        .emit('newChatBotMessage', { msg: dataReturn.answer });
    } catch (error) {
      console.error('[chatBot] API error:', error.message);

      this.server
        .to(roomName)
        .emit('newChatBotMessage', { msg: 'Chatbot server is unavailable' });
    }
  }
}
