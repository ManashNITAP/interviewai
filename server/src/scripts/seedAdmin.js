import 'dotenv/config';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { User } from '../models/User.model.js';

const run = async () => {
  const { ADMIN_EMAIL: email, ADMIN_PASSWORD: password, ADMIN_NAME: name = 'Admin' } = process.env;
  if (!email || !password) { console.error('Set ADMIN_EMAIL and ADMIN_PASSWORD'); process.exit(1); }
  await mongoose.connect(env.MONGO_URI);
  const existing = await User.findOne({ email });
  if (existing) { existing.role = 'admin'; await existing.save(); console.log(`Promoted ${email}`); }
  else { await User.create({ name, email, password, role: 'admin' }); console.log(`Created admin ${email}`); }
  await mongoose.disconnect();
  process.exit(0);
};
run().catch((e) => { console.error(e); process.exit(1); });
