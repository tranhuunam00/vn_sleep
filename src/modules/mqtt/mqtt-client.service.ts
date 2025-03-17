/* eslint-disable prettier/prettier */
import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mqtt from 'mqtt';

@Injectable()
export class MqttClientService implements OnModuleInit {
  private client: mqtt.MqttClient;

  onModuleInit() {
    this.connectToBroker();
  }

  private connectToBroker() {
    this.client = mqtt.connect(process.env.MQTT_URL); // Hoặc thay bằng broker của bạn

    this.client.on('connect', () => {
      console.log('Connected to MQTT broker');
      this.client.subscribe('test/topic', (err) => {
        if (err) {
          console.error('❌ Failed to subscribe:', err);
        } else {
          console.log('✅ Subscribed to test/topic');

          setTimeout(() => {
            console.log('📤 Publishing message...');
            this.client.publish('test/topic', 'Hello MQTT!');
          }, 2000); // Đợi 2 giây để chắc chắn đã subscribe xong
        }
      });
    });

    this.client.on('message', (topic, message) => {
      console.log(`Received message on ${topic}: ${message.toString()}`);
    });

    this.client.publish('message', '1234');
  }

  publishMessage(topic: string, message: string) {
    this.client.publish(topic, message, {}, (err) => {
      if (err) {
        console.error('Failed to publish message:', err);
      } else {
        console.log(`Message published to ${topic}`);
      }
    });
  }
}
