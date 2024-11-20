const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

// Initialize Firebase Admin with your configuration
const serviceAccount = {
  type: process.env.FIREBASE_TYPE,
  project_id: process.env.FIREBASE_PROJECT_ID,
  private_key_id: process.env.FIREBASE_PRIVATE_KEY_ID,
  private_key: process.env.FIREBASE_PRIVATE_KEY,
  client_email: process.env.FIREBASE_CLIENT_EMAIL,
  client_id: process.env.FIREBASE_CLIENT_ID,
  auth_uri: process.env.FIREBASE_AUTH_URI,
  token_uri: process.env.FIREBASE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
  client_x509_cert_url: process.env.FIREBASE_CLIENT_X509_CERT_URL,
  universe_domain: process.env.FIREBASE_UNIVERSE_DOMAIN
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://pravaah-firebase-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();

app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Generic handler for adding documents to any collection
app.post('/api/:collection', async (req, res) => {
    try {
      const { collection } = req.params;
      let data = { ...req.body };
  
      // Special handling for users collection (password hashing)
      if (collection === 'users' && data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }
  
      // Add timestamp
      data.createdAt = admin.firestore.FieldValue.serverTimestamp();
  
      const docRef = await db.collection(collection).add(data);
      
      res.status(201).json({
        success: true,
        id: docRef.id,
        message: `Document added to ${collection} successfully`
      });
    } catch (error) {
      console.error('Error adding document:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});