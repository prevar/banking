const admin = require("firebase-admin");

/*const type = process.envserver.TYPE
const project_id = process.envserver.PROJECT_ID
const private_key_id= process.envserver.PRIVATE_KEY_ID
const private_key= process.envserver.PRIVATE_KEY
const client_email= process.envserver.CLIENT_EMAIL
const client_id= process.envserver.CLIENT_ID
const auth_uri= process.envserver.AUTH_URI
const token_uri= process.envserver.TOKEN_URI
const auth_provider_x509_cert_url= process.envserver.AUTH_PROVIDER_X509_CERT_URL
const client_x509_cert_url= process.envserver.CLIENT_X509_CERT_URL
const universal_domain= process.envserver.UNIVERSE_DOMAIN   
*/
const type = "service_account";
const project_id = "bankapp-179da";
const private_key_id = "686c8a8698b1204228b4003627b07173174ff633";
const private_key =
  "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCuNYCm/M6EvBj7\niY2fNv/soTgWTUw+6A11epWsB2Xbekn4VxO2TZ1TS/FPSaKHgJ2SRlZF6gM7+BVo\nyJoZON5JntY17ODQvbCa8EriSzIFOrMGEIqcZnsAcmnCj2yuXIJ+NlRRnEnpAiYw\nkBzbuL76s0CdKkECLTkXn4cNO1XS07DG28dX0IjrD8wHESOJQKwDbpKXKReOvJj1\nj9ogy+/jpFHrSB6SV3zsQpodzhVeTPfJVdMuzB64e4Vo85wtxyW4XkzHKKeIH8Nc\nLd+OGj0T+jsarnL7vBfQ9c2bGN+F0FUUCctTMZNsGUkxUcQoIlPi6t0D9fRFWZ1Z\n4y8sT8fVAgMBAAECggEASYchdtmrHND7RmeHU9T17d0Z/CfB76cnzxbfR02UCy+x\nOtUd58sYhQi/n/R3WfPKDewMC9Q6azxJZQGOMOkUwUP+K6KAPPpjKPIU2TBdu2FM\nIFoo9tw2PDkONGUuvOUk2rp5mjx54ZPbpJGe7IosaUnxEqS77XxC5ZqaeNY7YhDu\n6Y4c/qenXJu47cV7pSvlhGwiF/Cp/MlRRXdlNFiJV5bg56sO9MLcicmE4OcRXI7S\ndTtScqKMnuuZMAhZ8NhK8Vl/MNL4KQBPSQGSbK3eHL/isdPleyvAPQCBkefrF+u9\nBQ9292l3jsVWmC5WqWqv5jyKVCwzReGA4duRpVHjPQKBgQDZpy2CPjxbmfvS5u4a\nM52sHyIM8REgPCmIBhXmwh4IGOhoWkOaPyKRHOReZRDJA/mwsjriNBKMYevA4rIE\nsrhaLLemFVw3bwo9Plb16Ii1zFP/R9D9m1g+3BYMXUq0yRGme/RwLCz6VL98Cd0L\neno/XaAK/0NkKq8GHRB18QIe3wKBgQDM5t1YNEXx9AwCSuZk+tTxIvLYs6Bks7+J\nE04huIdChEGAnFrxVLxH2BXv4g3JJkPGjGBPUKgfrxnshw5wqe6Gc6FjrUDA8vou\np55e1t3dZnyZ2zBjjQr1pid3QP5nTYoYnsLPsPxx2SPoG96SPFhysKgdJwAkhjz8\nsh/6l0FTywKBgELzEKWSfUB0AikijbUTkXmDbhbrBCiVOPU1YgFETraQ6tRGh6rn\nprtaVsjOb7ZVebWnbUNtXxM9f6YqVTXqv5hFTwxQX7hReKXUCi3EJGE/g8rvjVKl\nOSTE0CdnfvZTLxG16T+j5wXtkaUW556DQx1AsF0Rneou0v2fbRPKWaujAoGANlqz\nstdDCrkLinwl+/mSDVmRBC06ShxoncsyOb3Cm8GLwrs3YLdyrrhCsXzM3WQ6LGxG\njCPARY9kmBsHmJlrfd0kndVyzPxno4Kxf0UOW9H5EbNUdcQPeTSXWYozMmIeVQOg\neAniHa1VWhgyhaZebCYyonEbF5VIjlwOIaKIINsCgYEAvQWW4miWgKbu6OLfv5sW\nQhJGLymPz1ADVbNKIRLsmP6g1BQH3y0sDSFlsd5HZ+CkTUSUbaHL26DSwwqDjbMs\nh5Z3PRoyVlmyktHxuQ90Vm0liBcqkhKwiYAZ3ehhDzh4rm69XbFNEReYNVmf+aB3\nowaVW87dXYLaM9+6oHZiH3A=\n-----END PRIVATE KEY-----\n";
const client_email =
  "firebase-adminsdk-werjn@bankapp-179da.iam.gserviceaccount.com";
const client_id = "114430887340931727320";
const auth_uri = "https://accounts.google.com/o/oauth2/auth";
const token_uri = "https://oauth2.googleapis.com/token";
const auth_provider_x509_cert_url =
  "https://www.googleapis.com/oauth2/v1/certs";
const client_x509_cert_url =
  "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-werjn%40bankapp-179da.iam.gserviceaccount.com";
const universal_domain = "googleapis.com";

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
