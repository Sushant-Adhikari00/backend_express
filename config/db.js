const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://sushant:M%40ngoDb12@cluster0.6euuh1z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// REMINDER: For production, move this URI to a .env file (e.g., process.env.MONGO_URI)
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const connectDB = async () => {
  try {
    // Connect the client to the server(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

module.exports = { connectDB, client };