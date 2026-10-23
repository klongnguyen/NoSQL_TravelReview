const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://nguyenkimlong261105_db_user:iy2ZlcEP5wVN9zZA@cluster0.jw3w09j.mongodb.net/?retryWrites=true&w=majority";

async function run() {
  const client = new MongoClient(uri);
  try {
    console.log("Connecting to MongoDB Atlas...");
    await client.connect();
    console.log("Successfully connected to MongoDB Atlas!");
    
    const db = client.db("travel_review");
    const dbs = await client.db().admin().listDatabases();
    console.log("Available databases in Cluster0:");
    dbs.databases.forEach(d => console.log(` - ${d.name}`));
  } catch (err) {
    console.error("Connection failed with error:");
    console.error(err.message);
  } finally {
    await client.close();
  }
}

run();
