import db from '../models/index.js';

export const syncDB = (app, port) =>
  db.sequelize
    .sync({ alter: true })
    .then(() => {
      // startScheduler();

      console.log('Database synced');
      app.listen(port, () =>
        console.log(`Server is running at http://localhost:${port}`)
      );
    })
    .catch((err) => console.error('DB error:', err));
