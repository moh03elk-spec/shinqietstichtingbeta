/*
  Optionele backend voor Stripe Checkout.
  Vereist: `npm install express stripe`
  Starten: `STRIPE_SECRET_KEY=sk_test_... node api/server.js`
*/
const express = require('express');
const Stripe = require('stripe');
const path = require('path');

// Vervang dit met je ECHTE secret key in een .env bestand
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

const app = express();
const staticDir = path.resolve(__dirname, '..');

app.use(express.json());
app.use(express.static(staticDir)); // Serveert index.html en assets

app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { amountEuro } = req.body;
    const amount = Number(amountEuro);

    if (isNaN(amount) || amount < 2) {
      return res.status(400).json({ error: 'Ongeldig bedrag. Minimum is €2.' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'ideal'],
      success_url: 'https://shinqiet.nl/#doneren?success=true',
      cancel_url: 'https://shinqiet.nl/#doneren?canceled=true',
      currency: 'eur',
      line_items: [{
        price_data: {
          currency: 'eur',
          unit_amount: Math.round(amount * 100), // Stripe verwacht centen
          product_data: {
            name: 'Donatie Stichting Shinqiet',
            description: 'Uw bijdrage helpt ons educatieve en maatschappelijke projecten te realiseren.'
          }
        },
        quantity: 1
      }],
      allow_promotion_codes: true,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe API Error:', err.message);
    res.status(500).json({ error: 'Interne serverfout', details: err.message });
  }
});

const PORT = process.env.PORT || 5173;
app.listen(PORT, () => console.log(`Server draait op http://localhost:${PORT}`));