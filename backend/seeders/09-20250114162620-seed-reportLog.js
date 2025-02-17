module.exports = {
    async up(queryInterface) {
        await queryInterface.bulkInsert('reportlog', [
            {
                reportId: 1,
                userId: 3,
                comment: "Report Log 1",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                reportId: 2,
                userId: 3,
                comment: "Report Log 2",
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                reportId: 3,
                userId: 3,
                comment: "Report Log 3",
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ], {});
    },
    async down(queryInterface) {
        await queryInterface.bulkDelete('reportlog', null, {});
    }
};