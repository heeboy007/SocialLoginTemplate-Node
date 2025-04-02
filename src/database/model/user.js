import { DataTypes, Sequelize } from 'sequelize';

const user_tablename = "users";

const User = (sequelize) => {
    return sequelize.define('User', {
            id: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
            nickname: { type: DataTypes.TEXT, allowNull: false },
            email: { type: DataTypes.TEXT, allowNull: true },
            recent_login: { type: DataTypes.DATE, allowNull: false },
            login_method: { type: DataTypes.ENUM, values: ['google', 'kakao', 'naver'], allowNull: false },
            state: { type: DataTypes.ENUM, values: ['active', 'closed', 'suspended'], defaultValue: 'active', allowNull: false },
            social_media_external_id: { type: DataTypes.TEXT, allowNull: false },
            social_media_external_access_token: { type: DataTypes.TEXT },
        },
        {
            sequelize,
            tableName: user_tablename,
            indexes: [
                {
                    name: 'PRIMARY',
                    unique: true,
                    fields: [{ name: 'id' }]
                },
            ],
            timestamps: true,
            underscored: true
        }
    );
};

export {
    user_tablename,
    User
}
