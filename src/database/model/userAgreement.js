

import { DataTypes, Sequelize } from 'sequelize';

const user_agreement_tablename = "user_agreements";

const UserAgreement = (sequelize) => {
    return sequelize.define('UserAgreement', {
            id: { autoIncrement: true, type: DataTypes.INTEGER, allowNull: false, primaryKey: true },
            user_id: { type: DataTypes.INTEGER, allowNull: false, },
            terms_type: { type: DataTypes.TEXT, allowNull: false, },
            terms_version: { type: DataTypes.TEXT, allowNull: false, },
            agreed_at: { type: DataTypes.TIMESTAMP, allowNull: false, defaultValue: Sequelize.NOW },
        },
        {
            sequelize,
            tableName: user_agreement_tablename,
            timestamps: false
        }
    );
};

export {
    user_agreement_tablename,
    UserAgreement
}