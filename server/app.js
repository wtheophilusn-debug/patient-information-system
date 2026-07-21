// Patient Information System API - v1.1
const express = require('express');
const cors    = require('cors');
const morgan  = require('morgan');

const authRoutes         = require('./routes/authRoutes');
const userRoutes         = require('./routes/userRoutes');
const patientRoutes      = require('./routes/patientRoutes');
const parameterRoutes    = require('./routes/parameterRoutes');
const consultationRoutes = require('./routes/consultationRoutes');
const appointmentRoutes  = require('./routes/appointmentRoutes');
const reportRoutes       = require('./routes/reportRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

app.use('/api/auth',          authRoutes);
app.use('/api/users',         userRoutes);
app.use('/api/patients',      patientRoutes);
app.use('/api/parameters',    parameterRoutes);
app.use('/api/consultations', consultationRoutes);
app.use('/api/appointments',  appointmentRoutes);
app.use('/api/reports',       reportRoutes);

app.get('/', (req, res) => res.json({ message: 'PIS API running' }));

app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

module.exports = app;
