const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const Gig = require('./models/Gig');
const Job = require('./models/Job');
const Order = require('./models/Order');
const Review = require('./models/Review');
const Conversation = require('./models/Conversation');
const Message = require('./models/Message');

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
    console.log('Cleaning existing collection data...');
    await Message.deleteMany();
    await Conversation.deleteMany();
    await Review.deleteMany();
    await Order.deleteMany();
    await Gig.deleteMany();
    await Job.deleteMany();
    await User.deleteMany();

    console.log('Seeding 20 workers, 10 employers, 1 admin...');

    const workersData = [
      { name: 'Ramesh Farmer', email: 'ramesh@example.com', phone: '9876543201', role: 'worker', bio: 'Experienced tractor operator and crop cultivator based in Kangra.', skills: ['Farming', 'Tractor Driving'], location: { village: 'Palampur', district: 'Kangra', state: 'Himachal Pradesh' }, rating: 4.8, totalReviews: 4, isVerified: true },
      { name: 'Suresh Carpenter', email: 'suresh@example.com', phone: '9876543202', role: 'worker', bio: 'Expert local craftsman making customized furniture, cupboards, and roof carvings.', skills: ['Carpentry', 'Woodworking'], location: { village: 'Shani Shingnapur', district: 'Ahmednagar', state: 'Maharashtra' }, rating: 4.6, totalReviews: 3, isVerified: true },
      { name: 'Gopal Tailor', email: 'gopal@example.com', phone: '9876543203', role: 'worker', bio: 'Traditional Punjabi salwar-suit designer and wedding clothes stitcher.', skills: ['Tailoring', 'Weaving'], location: { village: 'Jassowal', district: 'Ludhiana', state: 'Punjab' }, rating: 4.9, totalReviews: 5, isVerified: true },
      { name: 'Gurpreet Singh', email: 'gurpreet@example.com', phone: '9876543204', role: 'worker', bio: 'Professional organic farmer and cattle feed advisor.', skills: ['Farming', 'Animal Husbandry'], location: { village: 'Chogawan', district: 'Amritsar', state: 'Punjab' }, rating: 4.5, totalReviews: 2, isVerified: true },
      { name: 'Amit Plumber', email: 'amit@example.com', phone: '9876543205', role: 'worker', bio: 'Rural tube-well specialist and borewell pipe repair specialist.', skills: ['Plumbing', 'Tubewell Repair'], location: { village: 'Bassi', district: 'Jaipur', state: 'Rajasthan' }, rating: 4.7, totalReviews: 3, isVerified: false },
      { name: 'Baldev Lohar', email: 'baldev@example.com', phone: '9876543206', role: 'worker', bio: 'Traditional blacksmith fabricating sickle, spade, and metal window grilles.', skills: ['Welding', 'Metalworking'], location: { village: 'Dhariwal', district: 'Gurdaspur', state: 'Punjab' }, rating: 4.4, totalReviews: 1, isVerified: true },
      { name: 'Hari Prasad', email: 'hari@example.com', phone: '9876543207', role: 'worker', bio: 'Certified house wiring and transformer bypass specialist.', skills: ['Electricals', 'Wiring'], location: { village: 'Malihabad', district: 'Lucknow', state: 'Uttar Pradesh' }, rating: 4.8, totalReviews: 4, isVerified: true },
      { name: 'Manpreet Kaur', email: 'manpreet@example.com', phone: '9876543208', role: 'worker', bio: 'Handloom weaver producing premium khadi kurtas and organic shawls.', skills: ['Weaving', 'Handloom'], location: { village: 'Bhuttico', district: 'Kullu', state: 'Himachal Pradesh' }, rating: 5.0, totalReviews: 2, isVerified: true },
      { name: 'Vikram Potter', email: 'vikram@example.com', phone: '9876543209', role: 'worker', bio: 'Clay artist producing eco-friendly pots, lamps, and decorative earthen vases.', skills: ['Pottery', 'Clay Art'], location: { village: 'Kumharpara', district: 'Bastar', state: 'Chhattisgarh' }, rating: 4.3, totalReviews: 1, isVerified: false },
      { name: 'Sunil Mason', email: 'sunil@example.com', phone: '9876543210', role: 'worker', bio: 'Bricklayer specialized in traditional biogas plant constructions.', skills: ['Masonry', 'Construction'], location: { village: 'Mulwad', district: 'Vijayapura', state: 'Karnataka' }, rating: 4.7, totalReviews: 2, isVerified: true },
      { name: 'Rajesh Welder', email: 'rajesh@example.com', phone: '9876543211', role: 'worker', bio: 'Experienced welder for steel gates, iron bars, and custom farm tool repairs.', skills: ['Welding'], location: { village: 'Anandpur', district: 'Mehsana', state: 'Gujarat' }, rating: 4.5, totalReviews: 2, isVerified: true },
      { name: 'Devendra Yadav', email: 'devendra@example.com', phone: '9876543212', role: 'worker', bio: 'Dairy farm expert with deep knowledge of cow milking machines and disease care.', skills: ['Animal Husbandry', 'Milking'], location: { village: 'Gwalior Rural', district: 'Gwalior', state: 'Madhya Pradesh' }, rating: 4.6, totalReviews: 3, isVerified: false },
      { name: 'Satnam Painter', email: 'satnam@example.com', phone: '9876543213', role: 'worker', bio: 'Wall painting and traditional folk art illustrations for village events.', skills: ['Wall Painting', 'Folk Art'], location: { village: 'Raikot', district: 'Ludhiana', state: 'Punjab' }, rating: 4.9, totalReviews: 4, isVerified: true },
      { name: 'Jagtar Singh', email: 'jagtar@example.com', phone: '9876543214', role: 'worker', bio: 'Harvester driving specialist and high-tech agricultural repairer.', skills: ['Farming', 'Harvester driving'], location: { village: 'Shahkot', district: 'Jalandhar', state: 'Punjab' }, rating: 4.8, totalReviews: 5, isVerified: true },
      { name: 'Sukhwinder Pal', email: 'sukhwinder@example.com', phone: '9876543215', role: 'worker', bio: 'Experienced carpenter skilled in wooden cartwheels and bullock yokes.', skills: ['Carpentry'], location: { village: 'Zira', district: 'Ferozepur', state: 'Punjab' }, rating: 4.7, totalReviews: 3, isVerified: true },
      { name: 'Dalbir Kumar', email: 'dalbir@example.com', phone: '9876543216', role: 'worker', bio: 'Plumbing contractor specialized in laying agricultural drip irrigation pipes.', skills: ['Plumbing', 'Drip Irrigation'], location: { village: 'Tohana', district: 'Fatehabad', state: 'Haryana' }, rating: 4.5, totalReviews: 2, isVerified: false },
      { name: 'Jaswinder Kaur', email: 'jaswinder@example.com', phone: '9876543217', role: 'worker', bio: 'Phulkari embroidery artist preserving rich heritage designs on bridal wear.', skills: ['Weaving', 'Embroidery'], location: { village: 'Sunam', district: 'Sangrur', state: 'Punjab' }, rating: 5.0, totalReviews: 6, isVerified: true },
      { name: 'Kuldeep Electric', email: 'kuldeep@example.com', phone: '9876543218', role: 'worker', bio: 'Local electrician repairing water pump motors and farm generators.', skills: ['Electricals', 'Motor Repair'], location: { village: 'Mansa Rural', district: 'Mansa', state: 'Punjab' }, rating: 4.6, totalReviews: 2, isVerified: true },
      { name: 'Harpreet Singh', email: 'harpreet@example.com', phone: '9876543219', role: 'worker', bio: 'Pesticide sprayer and soil testing consultant.', skills: ['Farming', 'Soil Testing'], location: { village: 'Bhikhi', district: 'Mansa', state: 'Punjab' }, rating: 4.7, totalReviews: 3, isVerified: true },
      { name: 'Gurdial Ram', email: 'gurdial@example.com', phone: '9876543220', role: 'worker', bio: 'Potter and terra cotta brick designer for rustic home interiors.', skills: ['Pottery', 'Masonry'], location: { village: 'Adampur', district: 'Jalandhar', state: 'Punjab' }, rating: 4.8, totalReviews: 4, isVerified: true }
    ];

    const employersData = [
      { name: 'Anita Employer', email: 'anita@example.com', phone: '9812345601', role: 'employer', location: { village: 'Pune City', district: 'Pune', state: 'Maharashtra' } },
      { name: 'Priya Sharma', email: 'priya@example.com', phone: '9812345602', role: 'employer', location: { village: 'Shimla City', district: 'Shimla', state: 'Himachal Pradesh' } },
      { name: 'Ranjeet Brar', email: 'ranjeet@example.com', phone: '9812345603', role: 'employer', location: { village: 'Ludhiana Town', district: 'Ludhiana', state: 'Punjab' } },
      { name: 'Harish Mehta', email: 'harish@example.com', phone: '9812345604', role: 'employer', location: { village: 'Chandigarh Sector', district: 'Chandigarh', state: 'Haryana' } },
      { name: 'Balwant Singh', email: 'balwant@example.com', phone: '9812345605', role: 'employer', location: { village: 'Amritsar City', district: 'Amritsar', state: 'Punjab' } },
      { name: 'Ravinder Gill', email: 'ravinder@example.com', phone: '9812345606', role: 'employer', location: { village: 'Jalandhar Cantt', district: 'Jalandhar', state: 'Punjab' } },
      { name: 'Sanjay Kumar', email: 'sanjay@example.com', phone: '9812345607', role: 'employer', location: { village: 'Jaipur Outer', district: 'Jaipur', state: 'Rajasthan' } },
      { name: 'Vijay Patil', email: 'vijay@example.com', phone: '9812345608', role: 'employer', location: { village: 'Nashik Village', district: 'Nashik', state: 'Maharashtra' } },
      { name: 'Kuldip Sodhi', email: 'kuldip@example.com', phone: '9812345609', role: 'employer', location: { village: 'Patiala Gated', district: 'Patiala', state: 'Punjab' } },
      { name: 'Joginder Bhatia', email: 'joginder@example.com', phone: '9812345610', role: 'employer', location: { village: 'Karnal City', district: 'Karnal', state: 'Haryana' } }
    ];

    const adminUser = {
      name: 'Super Admin',
      email: 'admin@ruralconnect.com',
      phone: '9999999999',
      role: 'admin',
      location: { village: 'Delhi Cantt', district: 'Central Delhi', state: 'Delhi' }
    };

    const password = 'password123';

    // Loop and use User.create to ensure hook executes passwords hashing
    const workers = [];
    for (let w of workersData) {
      const created = await User.create({ ...w, password });
      workers.push(created);
    }
    console.log(`Successfully created ${workers.length} workers.`);

    const employers = [];
    for (let e of employersData) {
      const created = await User.create({ ...e, password });
      employers.push(created);
    }
    console.log(`Successfully created ${employers.length} employers.`);

    const admin = await User.create({ ...adminUser, password });
    console.log('Successfully created Admin.');

    console.log('Seeding 30 Gigs for workers...');

    const categories = ['Farming', 'Carpentry', 'Tailoring', 'Plumbing', 'Weaving', 'Pottery', 'Welding', 'Masonry', 'Electricals'];

    const baseGigs = [
      {
        title: 'High efficiency agricultural plowing and tractor assistance',
        description: 'I will plow your fields using my high-performance Mahindra tractor. Specialized in deep soil aeration, seedbed layering, and levelling across all kinds of agricultural landscapes.',
        category: 'Farming',
        packages: [
          { name: 'Basic (1 Acre)', price: 1500, deliveryDays: 1, features: ['1 Acre plowing', 'Fuel included', 'Double rotavator pass'] },
          { name: 'Standard (3 Acres)', price: 4000, deliveryDays: 2, features: ['3 Acres plowing', 'Fuel included', 'Double pass rotavator + disc harrow'] },
          { name: 'Premium (5 Acres)', price: 6500, deliveryDays: 3, features: ['5 Acres plowing', 'Soil moisture level check', 'Tractor rotavator + leveling'] }
        ],
        tags: ['tractor', 'plowing', 'farming', 'rotavator']
      },
      {
        title: 'Custom solid teak wood furniture crafting',
        description: 'Get hand-crafted, beautiful, durable solid wood teak sofas, cupboards, side tables, or custom carvings directly from an experienced village carpenter with 15 years of wisdom.',
        category: 'Carpentry',
        packages: [
          { name: 'Basic Stool', price: 1200, deliveryDays: 3, features: ['Small tea stool', 'Teak wood', 'Hand polished'] },
          { name: 'Standard Dining Chair', price: 3500, deliveryDays: 5, features: ['1 Premium dining chair', 'Back support carving', 'High gloss polish'] },
          { name: 'Premium Cabinet', price: 12000, deliveryDays: 10, features: ['Medium storage cabinet', 'Intricate patterns', 'Home delivery assembly'] }
        ],
        tags: ['furniture', 'carpentry', 'teak', 'sofa']
      },
      {
        title: 'Hand-woven Punjabi suits and traditional outfits',
        description: 'Exquisite custom tailored salwar suits, sherwanis, and wedding trousseau styled, fitted, and stitched to perfection using quality localized fabrics and modern finishing.',
        category: 'Tailoring',
        packages: [
          { name: 'Simple Salwar Suit', price: 800, deliveryDays: 2, features: ['Stitching only', 'Custom measurements', 'Overlock stitch'] },
          { name: 'Designer Suit', price: 1800, deliveryDays: 4, features: ['Lace attachments', 'Custom collar designs', 'Matching mask'] },
          { name: 'Traditional Bridal Suit', price: 4500, deliveryDays: 7, features: ['Heavy embroidery integration', 'Custom design consult', 'Perfect fit guarantee'] }
        ],
        tags: ['tailoring', 'punjabi suit', 'designer', 'stitching']
      },
      {
        title: 'Agricultural tube-well and drip irrigation pipes plumbing',
        description: 'Specialist services for digging, pipe laying, and maintaining drip/sprinkler systems for orchards, greenhouses, and extensive open crops.',
        category: 'Plumbing',
        packages: [
          { name: 'Basic Sprinkler Repair', price: 900, deliveryDays: 1, features: ['Up to 5 sprinkler nozzle swaps', 'Leakage detection'] },
          { name: 'Standard Pipe Laying', price: 3000, deliveryDays: 2, features: ['Laying up to 100 meters pipeline', 'Pressure valves config'] }
        ],
        tags: ['irrigation', 'plumbing', 'drip', 'tubewell']
      },
      {
        title: 'Eco-friendly earthen pottery and clay pots wholesale',
        description: 'Individually spun terracotta clay pots, curd bowls, storage vessels, and decorative hand-painted lamps perfect for homes and hotels.',
        category: 'Pottery',
        packages: [
          { name: 'Curd Bowls Set (10 pcs)', price: 450, deliveryDays: 2, features: ['Eco-friendly curd pots', 'Biodegradable clay'] },
          { name: 'Premium Decorative Vases', price: 1500, deliveryDays: 4, features: ['3 Big hand-painted vases', 'Glossy finishing'] }
        ],
        tags: ['clay', 'pottery', 'lamps', 'handcrafted']
      }
    ];

    const gigs = [];
    for (let i = 0; i < 30; i++) {
      const worker = workers[i % workers.length];
      const baseGig = baseGigs[i % baseGigs.length];

      const created = await Gig.create({
        seller: worker._id,
        title: `I will offer premium ${baseGig.category.toLowerCase()} gig - ${worker.name}`,
        description: baseGig.description,
        category: baseGig.category,
        packages: baseGig.packages,
        tags: baseGig.tags,
        images: [`https://images.unsplash.com/photo-1592982537447-6f2a6a0c5c1b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80`],
        rating: Math.round((4.2 + (i % 9) * 0.1) * 10) / 10,
        totalOrders: 3 + (i % 12),
        isActive: true
      });
      gigs.push(created);
    }
    console.log(`Created ${gigs.length} gigs successfully.`);

    console.log('Seeding Jobs...');
    const jobs = await Job.insertMany([
      {
        employer: employers[0]._id,
        title: 'Need heavy plowing for 10-acre basmati crop',
        description: 'Looking for an experienced tractor driver with a disc rotavator. Must complete the plowing within 4 days. Fuel will be supplied at the field.',
        category: 'Farming',
        budget: { type: 'fixed', min: 10000, max: 12000 },
        duration: 'less than 1 month',
        locationRequired: 'Pune Outer Area',
        skills: ['Farming', 'Tractor Driving'],
        status: 'open',
        proposals: [
          { worker: workers[0]._id, bidAmount: 11000, coverLetter: 'I have a 60HP John Deere tractor and can finish the plowing in 3 days. Ready to start tomorrow.', estimatedDays: 3, status: 'pending' },
          { worker: workers[3]._id, bidAmount: 10500, coverLetter: 'Highly experienced and located near your farm. Let me handle it.', estimatedDays: 4, status: 'pending' }
        ]
      },
      {
        employer: employers[1]._id,
        title: 'Seeking wall painter for village health clinic renovation',
        description: 'Need a team or skilled painter to coat the exterior and paint folk health murals on the inner walls. Traditional patterns preferred.',
        category: 'Masonry',
        budget: { type: 'fixed', min: 8000, max: 10000 },
        duration: 'less than 1 month',
        locationRequired: 'Shimla District Village',
        skills: ['Wall Painting', 'Folk Art'],
        status: 'open',
        proposals: [
          { worker: workers[12]._id, bidAmount: 9000, coverLetter: 'I am a traditional folk artist and wall painter. I will draw beautiful healthcare messages on walls.', estimatedDays: 5, status: 'pending' }
        ]
      }
    ]);
    console.log(`Created ${jobs.length} jobs.`);

    console.log('Seeding Orders & Reviews...');
    const order1 = await Order.create({
      gig: gigs[0]._id,
      worker: workers[0]._id,
      employer: employers[0]._id,
      package: gigs[0].packages[0],
      price: gigs[0].packages[0].price,
      status: 'completed',
      deliveryDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      requirements: 'Please plow parallel to the water channels.'
    });

    const order2 = await Order.create({
      gig: gigs[1]._id,
      worker: workers[1]._id,
      employer: employers[2]._id,
      package: gigs[1].packages[1],
      price: gigs[1].packages[1].price,
      status: 'completed',
      deliveryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      requirements: 'Polished teak standard dining chair'
    });

    const order3 = await Order.create({
      gig: gigs[2]._id,
      worker: workers[2]._id,
      employer: employers[0]._id,
      package: gigs[2].packages[1],
      price: gigs[2].packages[1].price,
      status: 'active',
      requirements: 'Blue designer suit stitching'
    });

    console.log('Seeding reviews...');
    await Review.create({
      reviewer: employers[0]._id,
      reviewee: workers[0]._id,
      order: order1._id,
      rating: 5,
      comment: 'Excellent plowing Ramesh! Completed exactly on time, clean rotavator cuts.'
    });

    await Review.create({
      reviewer: employers[2]._id,
      reviewee: workers[1]._id,
      order: order2._id,
      rating: 4,
      comment: 'The wood quality is superb and Suresh did a fantastic polish. Highly satisfied.'
    });

    console.log('Seeding messaging chats...');
    const conv1 = await Conversation.create({
      participants: [workers[0]._id, employers[0]._id],
      lastMessage: 'Sure, I will come tomorrow morning at 8:00 AM.'
    });

    await Message.insertMany([
      { sender: employers[0]._id, receiver: workers[0]._id, conversationId: conv1._id.toString(), content: 'Hello Ramesh, can you plow my Palampur field tomorrow?' },
      { sender: workers[0]._id, receiver: employers[0]._id, conversationId: conv1._id.toString(), content: 'Ji, yes I am available. What is the total acreage?' },
      { sender: employers[0]._id, receiver: workers[0]._id, conversationId: conv1._id.toString(), content: 'It is about 2 acres. Standard rotavator is fine.' },
      { sender: workers[0]._id, receiver: employers[0]._id, conversationId: conv1._id.toString(), content: 'Sure, I will come tomorrow morning at 8:00 AM.' }
    ]);

    console.log('DATA SEEDING EXECUTED SUCCESSFULLY!');
    process.exit();
  } catch (error) {
    console.error(`Seeding error: ${error.stack}`);
    process.exit(1);
  }
};

importData();
