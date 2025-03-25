import { DataTypes } from 'sequelize';

const global_tablename = "globals";

const GlobalValue = (sequelize) => {
    return sequelize.define('GlobalValue', {
            schema_version: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, },
            total_session_time: { type: DataTypes.FLOAT, allowNull: false, },
            total_user_count: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, }
        },
        {
            sequelize,
            tableName: global_tablename,
            timestamps: true
        }
    );
};

export {
    global_tablename,
    GlobalValue
}