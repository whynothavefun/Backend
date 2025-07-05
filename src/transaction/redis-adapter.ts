import { Logger } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { ServerOptions } from 'socket.io';
import { Server } from 'socket.io';

export class RedisIoAdapter extends IoAdapter {
  private readonly logger = new Logger(RedisIoAdapter.name);

  createIOServer(port: number, options?: ServerOptions): Server {
    const server: Server = super.createIOServer(port, options);

    const pubClient = new Redis(process.env.REDIS_URL);
    const subClient = new Redis(process.env.REDIS_URL);

    pubClient.on('connect', () => this.logger.log('[Redis] Publisher connected'));
    subClient.on('connect', () => this.logger.log('[Redis] Subscriber connected'));
    pubClient.on('error', (err) => this.logger.error('[Redis pub] Error:', err));
    subClient.on('error', (err) => this.logger.error('[Redis sub] Error:', err));

    server.adapter(createAdapter(pubClient, subClient));

    return server;
  }
}
