'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('reportLog', [
            {
                reportId: 1,
                userId: 3,
                action: 'created',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                reportId: 2,
                userId: 3,
                action: 'updated',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                reportId: 3,
                userId: 3,
                action: 'deleted',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('reportLog', null, {});
    }
};