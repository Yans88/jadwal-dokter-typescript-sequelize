'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('jadwal_dokter', {
                id: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    primaryKey: true,
                    autoIncrement: true
                },
                day: {
                    type: Sequelize.STRING
                },
                time_start: {
                    type: Sequelize.TIME
                },
                time_end: {
                    type: Sequelize.TIME
                },
                quota: {
                    type: Sequelize.INTEGER,
                    defaultValue: 0
                },
                status: {
                    type: Sequelize.BOOLEAN,
                    defaultValue: false
                },
                date: {
                    type: Sequelize.DATE
                },
                doctor_id: {
                    type: Sequelize.BIGINT,
                    allowNull: false,
                    references: {
                        model: 'dokter',
                        key: 'id'
                    }
                },
                created_at: {
                    allowNull: false,
                    type: Sequelize.DATE
                },
                deleted_at: {
                    allowNull: true,
                    type: Sequelize.DATE
                }
            }
        );
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('jadwal_dokter');
    }
};
