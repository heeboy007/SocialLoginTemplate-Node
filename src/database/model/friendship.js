import { DataTypes } from 'sequelize';

const friendship_tablename = "friendships"

const Friendship = (sequelize) => {
    return sequelize.define('Friendship', {
            id: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
            user_id: { type: DataTypes.INTEGER, allowNull: false },
            friend_id: { type: DataTypes.INTEGER, allowNull: false },
            status: { type: DataTypes.ENUM, values: ['pending', 'accepted', 'blocked'], defaultValue: 'pending', allowNull: false },
            created_at: { type: DataTypes.TIMESTAMP, allowNull: false, defaultValue: Sequelize.NOW },
        },
        {
            sequelize,
            tableName: friendship_tablename,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    fields: [{ name: 'user_id' }]
                },
            ],
            timestamps: true
        }
    );
};

export {
    friendship_tablename,
    Friendship
}