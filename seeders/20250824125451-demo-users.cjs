'use strict';

const bcrypt = require('bcrypt');
const crypto = require('crypto');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-for-dev';

    const generatePassword = (email, role) => {
      const hash = crypto
        .createHmac('sha256', jwtSecret)
        .update(`${email}-${role}`)
        .digest('hex');
      return `Dev${hash.substring(0, 8)}!`;
    };

    const users = [
      {
        id: 1,
        email: 'admin@example.com',
        role: 'admin',
      },
      {
        id: 2,
        email: 'user1@example.com',
        role: 'user',
      },
      {
        id: 3,
        email: 'user2@example.com',
        role: 'user',
      },
    ];

    const userData = [];
    for (const user of users) {
      const plainPassword = generatePassword(user.email, user.role);
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      userData.push({
        id: user.id,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    await queryInterface.bulkInsert('users', userData, {});

    // Set the sequence to the next available ID (4 in this case)
    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('users', 'id'), (SELECT MAX(id) FROM users), true);"
    );
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});

    await queryInterface.sequelize.query(
      "SELECT setval(pg_get_serial_sequence('users', 'id'), 1, false);"
    );
  },
};
