require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')

async function run() {
  await mongoose.connect(process.env.MONGODB_URI)
  console.log('Connected to DB')
  
  const users = await User.find({})
  console.log('Registered Users:')
  users.forEach(u => {
    console.log(`- Name: ${u.name}, Email: ${u.email}, Role: ${u.role}, City: ${u.city}`)
  })
  
  await mongoose.connection.close()
}

run().catch(console.error)
