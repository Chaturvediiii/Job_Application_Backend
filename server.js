// API DOCUMENTATION
const swaggerUi = require('swagger-ui-express');
const swaggerDoc = require('swagger-jsdoc')

const express = require('express')
const colors = require('colors');
const app = express();
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
require('express-async-errors');

const options = {
  definition :{
    openapi : '3.0.0',
    info :{
      title : 'Job Application',
      description : 'MERN Job Application'
    },
    servers :[
      {
        url : 'http://localhost:3000'
      }
    ]
  },
  apis : ['./routes/*.js'],
}

const spec = swaggerDoc(options)

const helmet = require('helmet')
const xss = require('xss-clean')
const mongoSanitize = require('express-mongo-sanitize')

const db = require('./config/db');
const port = process.env.PORT || 3000;

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const jobRoutes = require('./routes/jobRoutes');
const errorMiddleware = require('./middlewares/errorMiddleware');

app.use(helmet())
app.use(xss())
app.use(mongoSanitize())

app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

app.use('/auth',authRoutes);
app.use('/user',userRoutes);
app.use('/job',jobRoutes)

app.use('/api-doc',swaggerUi.serve,swaggerUi.setup(spec))

app.use(errorMiddleware)

app.listen(port, () => {
  console.log(`App listening on port ${port}`.bgGreen.black);
})