const mongoose = require('mongoose');
const Provider = require('../models/Provider');
require('dotenv').config();

const providers = [
  {
    name: 'Профи Строй',
    email: 'profi@example.com',
    phone: '+7 (999) 111-11-11',
  }]
  