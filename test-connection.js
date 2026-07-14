const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGODB_URI;

console.log('🔗 Testing connection to:', uri.replace(/:[^:]*@/, ':****@'));

const client = new MongoClient(uri, {
    tls: true,
    tlsAllowInvalidCertificates: true,
    serverSelectionTimeoutMS: 5000,
});

async function test() {
    try {
        await client.connect();
        console.log('✅ Connected successfully!');
        const db = client.db('portfolio_db');
        const collections = await db.listCollections().toArray();
        console.log('📊 Collections:', collections.map(c => c.name));
        await client.close();
        console.log('✅ Test complete!');
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
        console.log('\n💡 Please check:');
        console.log('1. Username: abithachokka_db_user');
        console.log('2. Password: pJtT85evF3mkljQo');
        console.log('3. Cluster: cluster0.uvfkdps.mongodb.net');
        console.log('4. IP whitelist in Atlas');
    }
}

test();
