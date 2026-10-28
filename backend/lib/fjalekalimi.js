'use strict';

const crypto = require('node:crypto');

const N = 16384, R = 8, P = 1, GJATESIA = 64;

function scrypt(fjalekalimi, salt, n, r, p) {
  return new Promise((resolve, reject) => {
    crypto.scrypt(fjalekalimi.normalize('NFC'), salt, GJATESIA, { N: n, r, p, maxmem: 64 * 1024 * 1024 },
      (err, key) => (err ? reject(err) : resolve(key)));
  });
}

async function hash(fjalekalimi) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(fjalekalimi, salt, N, R, P);
  return ['scrypt', N, R, P, salt.toString('base64url'), key.toString('base64url')].join('$');
}

async function verifiko(fjalekalimi, ruajtur) {
  const pjeset = String(ruajtur || '').split('$');
  if (pjeset.length !== 6 || pjeset[0] !== 'scrypt') return false;
  const [, n, r, p, salt, pritur] = pjeset;
  const priturBuf = Buffer.from(pritur, 'base64url');
  const key = await scrypt(fjalekalimi, Buffer.from(salt, 'base64url'), +n, +r, +p);
  return key.length === priturBuf.length && crypto.timingSafeEqual(key, priturBuf);
}

module.exports = { hash, verifiko };
