import api from '../api/axios';

export async function processPayment({ bookingId, amount, onSuccess, onError }) {
  try {
    const orderRes = await api.post('/payment/create-order', { bookingId });
    const { orderId, amount: orderAmount, key } = orderRes.data;

    const options = {
      key,
      amount: orderAmount,
      currency: 'INR',
      name: 'BookTrip',
      description: `Booking #${bookingId}`,
      order_id: orderId,
      handler: async function (response) {
        try {
          const verifyRes = await api.post('/payment/verify', {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (verifyRes.data.success) {
            if (onSuccess) onSuccess(verifyRes.data.booking);
          }
        } catch (err) {
          if (onError) onError('Payment verification failed');
        }
      },
      modal: {
        ondismiss: function () {
          if (onError) onError('Payment cancelled by user');
        },
      },
      prefill: {
        contact: '',
        email: '',
      },
      theme: {
        color: '#6366f1',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error('Payment processing error:', error);
    if (onError) onError(error.message);
  }
}
