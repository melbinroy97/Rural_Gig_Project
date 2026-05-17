const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Gig = require('./models/Gig');
const Job = require('./models/Job');
const Order = require('./models/Order');

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/ruralconnect');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const importData = async () => {
  await connectDB();
  try {
    await Order.deleteMany();
    await Gig.deleteMany();
    await Job.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany([
      {
        name: 'Ramesh Farmer',
        email: 'ramesh@example.com',
        phone: '1234567890',
        password: 'password123',
        role: 'worker',
        location: { village: 'Palampur', district: 'Kangra', state: 'Himachal Pradesh' },
        skills: ['Farming', 'Tractor Driving'],
        rating: 4.8,
        totalReviews: 12
      },
      {
        name: 'Suresh Carpenter',
        email: 'suresh@example.com',
        phone: '0987654321',
        password: 'password123',
        role: 'worker',
        location: { village: 'Shani Shingnapur', district: 'Ahmednagar', state: 'Maharashtra' },
        skills: ['Carpentry', 'Woodworking'],
        rating: 4.5,
        totalReviews: 8
      },
      {
        name: 'Anita Employer',
        email: 'anita@example.com',
        phone: '1122334455',
        password: 'password123',
        role: 'employer',
        location: { village: 'Pune City', district: 'Pune', state: 'Maharashtra' }
      }
    ]);

    const worker1 = createdUsers[0]._id;
    const worker2 = createdUsers[1]._id;
    const employer = createdUsers[2]._id;

    const createdGigs = await Gig.insertMany([
      {
        seller: worker1,
        title: 'I will plow your field with my tractor',
        description: 'Experienced tractor driver available for plowing fields.',
        category: 'Farming',
        packages: [
          { name: 'Basic', price: 1500, deliveryDays: 1, features: ['1 Acre'] }
        ]
      },
      {
        seller: worker2,
        title: 'Custom wooden furniture crafting',
        description: 'I will make custom wooden chairs and tables.',
        category: 'Carpentry',
        packages: [
          { name: 'Basic', price: 5000, deliveryDays: 5, features: ['1 Chair'] }
        ]
      }
    ]);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};

importData();
