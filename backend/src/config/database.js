/**
 * MongoDB connection with retry logic and event logging
 */

const mongoose = require('mongoose');
const logger = require('../utils/logger');

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/interviewai_pro';

  mongoose.connection.on('connected', () => logger.info('✅ MongoDB connected'));
  mongoose.connection.on('error', (err) => logger.error('MongoDB error:', err));
  mongoose.connection.on('disconnected', () => logger.warn('⚠️  MongoDB disconnected'));

  // Graceful shutdown
  process.on('SIGINT', async () => {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed (app termination)');
    process.exit(0);
  });

  let connectionUri = uri;
  try {
    logger.info(`Connecting to MongoDB at: ${connectionUri}...`);
    await mongoose.connect(connectionUri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 3000,
      socketTimeoutMS: 45000,
    });
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      logger.warn(`⚠️ Failed to connect to local MongoDB (${err.message}). Starting MongoDB Memory Server...`);
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoServer = await MongoMemoryServer.create({
          binary: {
            version: '5.0.19'
          }
        });
        connectionUri = mongoServer.getUri();
        logger.info(`Starting MongoDB Memory Server at: ${connectionUri}`);
        
        await mongoose.connect(connectionUri, {
          maxPoolSize: 10,
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
        });

        // Stop memory server on shutdown
        process.on('SIGINT', async () => {
          await mongoServer.stop();
        });
      } catch (memErr) {
        logger.error('❌ Failed to start MongoDB Memory Server:', memErr.message);
        process.exit(1);
      }
    } else {
      logger.error('MongoDB initial connection failed:', err.message);
      process.exit(1);
    }
  }

  // Seed demo user
  try {
    const User = require('../models/User.model');
    const demoEmail = 'demo@interviewai.pro';
    const existingDemo = await User.findOne({ email: demoEmail });
    if (!existingDemo) {
      await User.create({
        name: 'Demo User',
        email: demoEmail,
        password: 'demo1234',
        targetRole: 'Full Stack Engineer',
        experienceLevel: 'mid',
        plan: 'pro',
        isActive: true,
      });
      logger.info('👤 Demo user seeded successfully');
    } else {
      logger.info('👤 Demo user already exists');
    }
  } catch (seedErr) {
    logger.error('❌ Failed to seed demo user:', seedErr.message);
  }
};

module.exports = connectDB;
