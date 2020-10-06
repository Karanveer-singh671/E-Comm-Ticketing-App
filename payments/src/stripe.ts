import Stripe from 'stripe'
// instantiate object from Stripe class
export const stripe = new Stripe(process.env.STRIPE_KEY!, {
  apiVersion: '2020-08-27',
  
})