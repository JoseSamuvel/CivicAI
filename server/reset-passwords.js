require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to DB')

  const accounts = [
    { email: 'jose2@civicai.com', password: 'jose123' },
    { email: 'josesamuvel003@gmail.com', password: 'password123' },
    { email: 'admin@civicai.com', password: 'admin123' }
  ]

  for (const acc of accounts) {
    const user = await User.findOne({ email: acc.email })
    if (user) {
      user.password = acc.password
      await user.save()
      console.log(`Updated password for ${acc.email}`)
    } else {
      console.log(`User ${acc.email} not found, skipping`)
    }
  }

  await mongoose.connection.close()
}

run().catch(console.error)
