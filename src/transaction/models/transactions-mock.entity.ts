import { BelongsTo, Column, ForeignKey, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import { TokenModel } from 'src/token/models/token.entity';

@Table({ tableName: 'transactions_mock' })
export class TransactionsMockModel extends Model<TransactionsMockModel> {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      isIn: [['buy', 'sell']],
    },
  })
  transactionType: string;

  @ForeignKey(() => TokenModel)
  @Column({
    type: DataTypes.UUID,
    allowNull: false,
  })
  tokenId: string;

  @BelongsTo(() => TokenModel, { as: 'token' })
  token: TokenModel;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  tokenName: string;

  @Column({
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
  })
  tokenAmount: number;

  @Column({
    type: DataTypes.DECIMAL(18, 8),
    allowNull: false,
  })
  hypeAmount: number;

  @Column({
    type: DataTypes.TEXT,
    allowNull: false,
  })
  transactionHash: string;

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
