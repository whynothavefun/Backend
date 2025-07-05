import { WebSocketGateway, SubscribeMessage, WebSocketServer, ConnectedSocket, MessageBody } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Transaction } from 'src/common/types/transaction';
import { Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { TokenIdDto } from './dto/token-id.dto';

@WebSocketGateway({ cors: true })
export class TransactionGateway {
  private readonly logger = new Logger(TransactionGateway.name);

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('subscribeToTokenTransactions')
  @UsePipes(new ValidationPipe())
  handleSubscribe(@MessageBody() input: TokenIdDto, @ConnectedSocket() client: Socket) {
    try {
      client.join(input.tokenId);
    } catch (error) {
      this.logger.error('Error in handleSubscribe:', error);
    }
  }

  @SubscribeMessage('unsubscribeFromTokenTransactions')
  @UsePipes(new ValidationPipe())
  handleUnsubscribe(@MessageBody() input: TokenIdDto, @ConnectedSocket() client: Socket) {
    try {
      client.leave(input.tokenId);
    } catch (error) {
      this.logger.error('Error in handleUnsubscribe:', error);
    }
  }

  broadcastTransaction(transaction: Transaction) {
    try {
      const tokenId = transaction.tokenId;
      if (!tokenId) return;
      this.server.to(tokenId).emit('transaction', transaction);
    } catch (error) {
      this.logger.error('Error in broadcastTransaction:', error);
    }
  }
}
