const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const adventureRoute = require('./routes/adventure');
const PORT = process.env.PORT || 8800;

dotenv.config();

mongoose.connect(process.env.MONGO_URL).then(
  () => console.log('MongoDB connection successful'),
  err => console.log(err)
);

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", usersRoute);
app.use("/api/auth", authRoute);
app.use("/api/adventure", adventureRoute);

app.listen(PORT, () =>
  console.log(`Backend is up and running on port ${PORT}...`)
);