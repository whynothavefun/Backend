import { DataTypes } from 'sequelize';
import { Table, Column, Model, ForeignKey, BelongsTo, HasMany, PrimaryKey } from 'sequelize-typescript';

@Table({ tableName: 'thread_messages' })
export class ThreadMessageModel extends Model<ThreadMessageModel> {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  })
  declare threadMessageId: string;

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
    type: DataTypes.TEXT,
    allowNull: false,
  })
  message: string;

  @ForeignKey(() => ThreadMessageModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: true,
  })
  parentId: string;

  @BelongsTo(() => ThreadMessageModel, 'parentId')
  parent: ThreadMessageModel;

  @HasMany(() => ThreadMessageModel, 'parentId')
  replies: ThreadMessageModel[];

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: 0,
  })
  likeCount: number;

  @Column({
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  })
  createdAt: Date;
}
