import { Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { ThreadMessageModel } from './thread-messages.entity';
import { TokenModel } from './token.entity';
import { DataTypes } from 'sequelize';

@Table({ tableName: 'message_likes' })
export class MessageLikesModel extends Model<MessageLikesModel> {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  })
  declare messageLikeId: string;

  @ForeignKey(() => ThreadMessageModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  messageId: string;

  @ForeignKey(() => TokenModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  tokenId: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  userWallet: string;

  @Column({
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  })
  createdAt: Date;
}
