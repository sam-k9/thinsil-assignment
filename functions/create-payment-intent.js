//domain/.netlify/functions/create-payment-intent
require("dotenv").config();

const stripe = require("stripe")(process.env.REACT_APP_STRIPE_SECRET_KEY);

exports.handler = async function (event, context) {
  if (event.body) {
    const { cart, shipping_fee, total_amount } = JSON.parse(event.body);

    const calulateOrderAmount = () => {
      return shipping_fee + total_amount;
    };

    try {
      const paymenyIntent = await stripe.paymentIntents.create({
        amount: calulateOrderAmount(),
        currency: "inr",
      });

      return {
        statusCode: 200,
        body: JSON.stringify({ clientSecret: paymenyIntent.client_secret }),
      };
    } catch (error) {
      return {
        statusCode: 500,
        body: JSON.stringify({ msg: error.message }),
      };
    }
  }

  return {
    statusCode: 200,
    body: "create payment intent",
  };
};
