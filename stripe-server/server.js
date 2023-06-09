// Set your secret key. Remember to switch to your live secret key in production.
// See your keys here: https://dashboard.stripe.com/apikeys
const express = require('express');
const app = express();
const dotenv = require('dotenv');
dotenv.config();
const bodyParser = require('body-parser')
const stripe = require('stripe')(process.env.STRIPE_SECRET);


// create application/json parser
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })

// parse various different custom JSON types as JSON
app.use(bodyParser.json({ type: 'application/*+json' }))

// parse some custom thing into a Buffer
app.use(bodyParser.raw({ type: 'application/vnd.custom-type' }))

// parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))

// In a new endpoint on your server, create a ConnectionToken and return the
// `secret` to your app. The SDK needs the `secret` to connect to a reader.


app.get('/config', async (req, res) => {
  console.log("FETCH_CONFIGURATION")
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

app.post('/create-payment-intent', jsonParser, async (req, res) => {
  console.log("PAYMENT-INTENT", req.body)
  const paymentIntent = await stripe.paymentIntents.create(req.body)
  
  const clientSecret = paymentIntent.client_secret
  console.log({ clientSecret })
  res.json({ secret: clientSecret });
});

// This example sets up an endpoint using the Express framework.
// Watch this video to get started: https://youtu.be/rPR2aJ6XnAc.

app.post('/payment-sheet', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  console.log("PAYMENT-SHEET")
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2020-08-27' }
  );
  const setupIntent = await stripe.setupIntents.create({
    customer: customer.id,
    payment_method_types: ['card'],
    amount: 1099,
    currency: 'usd',
  });
  res.json({
    setupIntent: setupIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

app.post('/payment-sheet-ui', async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  console.log("PAYMENT-SHEET-UI")
  // Use an existing Customer ID if this is a returning customer.
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2020-08-27' }
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 2000,
    currency: 'usd',
    automatic_payment_methods: { enabled: true },

  });
  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});





app.post('/create-payment-intent-google', jsonParser, async (req, res) => {
  console.log("Request triggered", req.body)
  const paymentIntent = await stripe.paymentIntents.create(req.body);

  const clientSecret = paymentIntent.client_secret
  console.log({ clientSecret })

  res.json({ secret: clientSecret });
});

app.listen(3000, () => {
  console.log('Running on port 3000');
});