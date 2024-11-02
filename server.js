// server.js
import app from './app.js';
import logger, { consoleLog } from './utils/logger.js';

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    logger.info(`Server started on port ${PORT}`);
    consoleLog.success(`Server running on port ${PORT} 🌐`);
});
