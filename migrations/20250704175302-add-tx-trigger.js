'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION notify_new_transaction()
      RETURNS TRIGGER AS $$
      DECLARE
        payload TEXT;
      BEGIN
        payload := row_to_json(NEW)::TEXT;
        PERFORM pg_notify('new_transaction', payload);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER tx_notify_trigger
      AFTER INSERT ON transactions
      FOR EACH ROW EXECUTE FUNCTION notify_new_transaction();
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS tx_notify_trigger ON transactions;
      DROP FUNCTION IF EXISTS notify_new_transaction();
    `);
  }
};
