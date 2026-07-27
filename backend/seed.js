const mysql = require('mysql2/promise');

async function seed() {
  const connectionConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'Expense@123',
    multipleStatements: true
  };

  if (process.env.DB_SSL === 'true') {
    connectionConfig.ssl = { rejectUnauthorized: false };
  }

  const connection = await mysql.createConnection(connectionConfig);
  const dbName = process.env.DB_NAME || 'expense_tracker';

  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\``);
    await connection.query(`USE \`${dbName}\``);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        icon VARCHAR(50),
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS budgets (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        month INT NOT NULL,
        year INT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,
        UNIQUE KEY unique_budget (category_id, month, year)
      )
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS expenses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        description VARCHAR(255),
        expense_date DATE NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      )
    `);

    const [rows] = await connection.query('SELECT COUNT(*) as count FROM categories');
    if (rows[0].count === 0) {
      const defaultCategories = [
        ['Groceries', '🛒', true],
        ['Rent', '🏠', true],
        ['Transport', '🚗', true],
        ['Utilities', '💡', true],
        ['Food & Dining', '🍽️', true],
        ['Entertainment', '🎬', true],
        ['Shopping', '🛍️', true],
        ['Health', '🏥', true],
        ['Education', '📚', true],
        ['Others', '📦', true]
      ];

      await connection.query(
        'INSERT INTO categories (name, icon, is_default) VALUES ?',
        [defaultCategories]
      );
      console.log('Default categories seeded successfully.');
    } else {
      console.log('Categories already exist, skipping seed.');
    }

    console.log('Database setup complete!');
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

seed();
