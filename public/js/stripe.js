/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51HaphpByPQcI5yD6HdvlRlreW5tNnvMAjvCOOiDZEt6CjQ31MyeJxi6FnnR2Bqj0OT4nQcOMLdfq1tF0xt4GFeY800YZR48peq'
);

export const bookTour = async (tourId) => {
  try {
    // 1) Get checkout session from API
    const response = await axios(
      `/api/v1/bookings/checkout-session/${tourId}`
    );
    console.log(response);

    // 2) Create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: response.data.session.id,
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
