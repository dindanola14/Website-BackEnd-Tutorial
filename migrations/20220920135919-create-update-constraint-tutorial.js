'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const transaction = await queryInterface.sequelize.transaction();
    try {
      await queryInterface.removeConstraint(
        'tutorial',
        'tutorial_id_category_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('tutorial', {
        type: 'foreign key',
        fields: ['id_category'], 
        name: 'tutorial_id_category_fkey',
        references: {
          table: 'category',
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
        'tutorial',
        'tutorial_id_category_fkey',
        { transaction }
      );
      await queryInterface.addConstraint('tutorial', {
        type: 'foreign key',
        fields: ['id_category'],
        name: 'tutorial_id_category_fkey',
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