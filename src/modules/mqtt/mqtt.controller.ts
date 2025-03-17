/* eslint-disable prettier/prettier */
import { Controller, Get, Param } from '@nestjs/common';
import { MqttClientService } from './mqtt-client.service';

@Controller('mqtt')
export class MqttController {
  constructor(private readonly mqttClientService: MqttClientService) {}

  @Get('send/:message')
  sendMessage(@Param('message') message: string) {
    this.mqttClientService.publishMessage('test/topic', message);
    return `Message sent: ${message}`;
  }
}
