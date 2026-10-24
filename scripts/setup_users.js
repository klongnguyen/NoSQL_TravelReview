const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://nguyenkimlong261105_db_user:iy2ZlcEP5wVN9zZA@cluster0.jw3w09j.mongodb.net/?retryWrites=true&w=majority";

async function setup() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('Travel_Review');
    const templateUser = await db.collection('users').findOne({ email: 'longo.member@gmail.com' });
    const hash = templateUser.passwordHash;

    await db.collection('users').updateOne(
      { email: 'admin@longo.vn' },
      { 
        $set: { 
          email: 'admin@longo.vn', 
          passwordHash: hash, 
          fullName: 'Quản trị viên LonGo', 
          role: 'Admin', 
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    await db.collection('users').updateOne(
      { email: 'member@longo.vn' },
      { 
        $set: { 
          email: 'member@longo.vn', 
          passwordHash: hash, 
          fullName: 'Nguyễn Văn Du Khách', 
          role: 'Member', 
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    console.log('Setup users complete! Both admin@longo.vn and member@longo.vn have password: Member@123');
  } finally {
    await client.close();
  }
}

setup();
