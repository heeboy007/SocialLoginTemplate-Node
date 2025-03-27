
import { DataTypes, Sequelize } from 'sequelize';

const term_tablename = "terms";

const Terms = (sequelize) => {
    return sequelize.define('Terms', {
            id: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
            type: { type: DataTypes.TEXT, allowNull: false, },
            version: { type: DataTypes.TEXT, allowNull: false, },
            content: { type: DataTypes.TEXT, allowNull: false, },
            effective_at: { type: DataTypes.DATE, allowNull: false, timezone: true },
            created_at: { type: DataTypes.DATE, allowNull: false, defaultValue: Sequelize.NOW, timezone: true },
        },
        {
            sequelize,
            tableName: term_tablename,
            timestamps: false
        }
    );
};

export {
    term_tablename,
    Terms
}