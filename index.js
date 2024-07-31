import express from 'express';
import midtransClient from 'midtrans-client';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Endpoint root untuk memastikan API berjalan
app.get('/', (req, res) => {
  res.send('API is running');
});

// Endpoint POST untuk membuat transaksi Midtrans
app.post('/', async (req, res) => {
  const { order_id, gross_amount, customer_details } = req.body;

  console.log('Request received:', req.body);

  // Membuat instance Snap API
  let snap = new midtransClient.Snap({
    isProduction: false,
    serverKey: 'SB-Mid-server-aVSYun8nN8bkx0Dg3aacu-Sn' // Ganti dengan server key Anda
  });

  // Mengatur parameter transaksi
  let parameter = {
    transaction_details: {
      order_id: order_id,
      gross_amount: gross_amount
    },
    customer_details: customer_details,
    enabled_payments: ["qris"]
  };

  try {
    // Membuat transaksi
    const transaction = await snap.createTransaction(parameter);
    const transactionToken = transaction.token;
    console.log('Transaction Token:', transactionToken);

    // Mengirim response dengan token transaksi
    res.status(200).json({ snapToken: transactionToken });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Menjalankan server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
