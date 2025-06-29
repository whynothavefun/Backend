import { DataTypes } from 'sequelize';
import { Column, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({ tableName: 'tokens' })
export class TokenModel extends Model<TokenModel> {
  @PrimaryKey
  @Column({
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull: false,
  })
  declare tokenId: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  userWallet: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  tokenName: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  tokenSymbol: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  artwork: string;

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: 0,
  })
  mcap: number;

  @Column({
    type: DataTypes.INTEGER,
    defaultValue: 0,
  })
  volume_24h: number;

  @Column({
    type: DataTypes.DOUBLE,
    defaultValue: 0,
  })
  price_change_24h: number;

  @Column({
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  })
  createdAt: Date;
}
