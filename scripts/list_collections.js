const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://nguyenkimlong261105_db_user:iy2ZlcEP5wVN9zZA@cluster0.jw3w09j.mongodb.net/?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db("Travel_Review");
    const collections = await db.listCollections().toArray();
    console.log(`Collections in Travel_Review (${collections.length}):`);
    collections.forEach(c => console.log(` - ${c.name}`));
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

run();
