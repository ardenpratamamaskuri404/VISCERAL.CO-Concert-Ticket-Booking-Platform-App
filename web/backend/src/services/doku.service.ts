import crypto from 'crypto-js';
import axios from 'axios';

const DOKU_CLIENT_ID = process.env.DOKU_CLIENT_ID || '';
const DOKU_SECRET_KEY = process.env.DOKU_SECRET_KEY || '';
const DOKU_BASE_URL = process.env.DOKU_SANDBOX_BASE_URL || 'https://api-sandbox.doku.com';

export const generateDokuSignature = (body: any, clientId: string, requestId: string, requestTimestamp: string, requestTarget: string, secretKey: string) => {
  const bodyString = JSON.stringify(body);
  const digest = crypto.enc.Base64.stringify(crypto.SHA256(bodyString));
  
  const componentSignature = `Client-Id:${clientId}\nRequest-Id:${requestId}\nRequest-Timestamp:${requestTimestamp}\nRequest-Target:${requestTarget}\nDigest:${digest}`;
  
  const hmac = crypto.HmacSHA256(componentSignature, secretKey);
  return `HMACSHA256=${crypto.enc.Base64.stringify(hmac)}`;
};

export const createDokuPayment = async (order: any, totalAmount: number, callbackUrl?: string) => {
  const requestId = crypto.lib.WordArray.random(16).toString();
  const requestTimestamp = new Date().toISOString().slice(0, 19) + 'Z';

  const defaultCallback = `http://localhost:5173/order-success/${order.id}`;

  const requestBody = {
    order: {
      amount: totalAmount,
      invoice_number: `${order.orderNumber}_R${Date.now()}`,
      currency: "IDR",
      callback_url: callbackUrl || defaultCallback
    },
    payment: {
      payment_due_date: 5
    }
  };

  const signature = generateDokuSignature(
    requestBody, 
    DOKU_CLIENT_ID, 
    requestId, 
    requestTimestamp, 
    '/checkout/v1/payment', 
    DOKU_SECRET_KEY
  );

  try {
    const dokuResponse = await axios.post(`${DOKU_BASE_URL}/checkout/v1/payment`, requestBody, {
      headers: {
        'Client-Id': DOKU_CLIENT_ID,
        'Request-Id': requestId,
        'Request-Timestamp': requestTimestamp,
        'Signature': signature,
        'Content-Type': 'application/json'
      }
    });

    return {
      success: true,
      paymentUrl: dokuResponse.data?.response?.payment?.url
    };
  } catch (error: any) {
    console.error('DOKU API Error:', error.response?.data || error.message);
    return {
      success: false,
      message: 'Gagal menghubungi DOKU API'
    };
  }
};
