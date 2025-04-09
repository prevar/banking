const conf = require('dotenv').config();
const admin = require("firebase-admin");

const type = process.env.TYPE
const project_id = process.env.PROJECT_ID
const private_key_id= process.env.PRIVATE_KEY_ID
const private_key= process.env.PRIVATE_KEY
const client_email= process.env.CLIENT_EMAIL
const client_id= process.env.CLIENT_ID
const auth_uri= process.env.AUTH_URI
const token_uri= process.env.TOKEN_URI
const auth_provider_x509_cert_url= process.env.AUTH_PROVIDER_X509_CERT_URL
const client_x509_cert_url= process.env.CLIENT_X509_CERT_URL
const universal_domain= process.env.UNIVERSE_DOMAIN   


//credential grants access to firebase services
admin.initializeApp({
  credential: admin.credential.cert({
    type,
    project_id,
    private_key_id,
    private_key: private_key.replace(/\\n/g, "\n"),
    client_email,
    client_id,
    auth_uri,
    token_uri,
    auth_provider_x509_cert_url,
    client_x509_cert_url,
    universal_domain,
  }),
});

module.exports = admin;
