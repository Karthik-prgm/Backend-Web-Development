'use strict';
// routes/payments.js
//
// POST /payments is idempotent: a given Idempotency-Key creates at most one
// real charge. Retries receive the exact response saved for the first request.

const router = require('express').Router();
const { charges, idempotency, nextChargeId } = require('../store');

router.post('/', (req, res) => {
  const key = req.headers['idempotency-key'];

  // A missing/empty key cannot safely identify a retry.
  if (!key) {
    return res.status(400).json({
      error: {
        code: 'IDEMPOTENCY_KEY_REQUIRED',
        message: 'Idempotency-Key header is required'
      }
    });
  }

  // Return the original status and body without charging again.
  if (idempotency.has(key)) {
    const cached = idempotency.get(key);
    return res.status(cached.status).json(cached.body);
  }

  // A new key represents a new payment operation.
  const amount = req.body && req.body.amount;
  const charge = { id: nextChargeId(), amount, status: 'charged' };
  charges.push(charge);

  const response = {
    status: 201,
    body: { id: charge.id, amount: charge.amount, status: charge.status }
  };

  idempotency.set(key, response);
  return res.status(response.status).json(response.body);
});

module.exports = router;
