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
  declare id: string;

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
    type: DataTypes.TEXT,
    allowNull: false,
  })
  artwork: string;

  @Column({
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  })
  createdAt: Date;
}
