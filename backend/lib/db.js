'use strict';

const { Pool } = require('pg');
const konfigurimi = require('./konfigurimi');

const cfg = konfigurimi.lexo();
const db = new Pool({ ...cfg.db, max: 10 });

module.exports = db;
