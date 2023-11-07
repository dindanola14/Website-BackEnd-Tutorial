'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'detail',
        'detail_id_tutorial_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('detail', {
        type: 'foreign key',
        fields: ['id_tutorial'], 
        name: 'detail_id_tutorial_fkey',
        references: {
          table: 'tutorial',
          field: 'id',
        },
        onDelete: 'CASCADE',
        transaction
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'detail',
        'detail_id_tutorial_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('detail', {
        type: 'foreign key',
        fields: ['id_tutorial'],
        name: 'detail_id_tutorial_fkey',
        references: {
          table: 'category',
          field: 'id',
        },
        transaction
      });
      return transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  },
};