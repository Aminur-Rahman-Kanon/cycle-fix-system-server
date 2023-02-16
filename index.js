const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

app.use(express.json());
app.use(cors());

//mongoDB initialization
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(res => console.log('database connected')).catch(err => console.log(err));

//schema
const testimonialSchema = require('./schema/schema').testimonialSchema;
const camsEnquirySchema = require('./schema/schema').camsEnquirySchema;
const registrationSchema = require('./schema/schema').registrationSchema;
const contactQuerySchema = require('./schema/schema').contactQuerySchema;
const bookingSchema = require('./schema/schema').bookingSchema;
const xiaomiQuery = require('./schema/schema').xiaomiQuery;

//model
const testimonialModel = mongoose.model('testimonial', testimonialSchema);
const camsEnquiryModel = mongoose.model('cams-enquiry', camsEnquirySchema);
const registrationModel = mongoose.model('registered-user', registrationSchema);
const contactQueryModel = mongoose.model('contact-query', contactQuerySchema);
const bookingModel = mongoose.model('Customer-Booking', bookingSchema);
const xiaomiModel = mongoose.model('xiaomi-query', xiaomiQuery);


//route
app.use('/bookings', (req, res) => {
    bookingModel.find({}).then(response => {
        const filteredDates = response.sort((a, b) => new Date(a.date) - new Date(b.date));
        const test1 = {};
        let index = 0;
        filteredDates.map(item => {
            if (test1.hasOwnProperty(item.date)){
                index ++;
                test1[item.date][index] = item;
            }
            else {
                test1[item.date] = {};
                index = 0;
                test1[item.date][index] = item;
            }
        })
        res.json({ status: 'success', data: test1 });
    
    })
    .catch(err => res.json({ status: 'error' }));
})

app.use('/cams-query', (req, res) => {
    camsEnquiryModel.find({}).then(response => res.json({ status: 'success', data: response })).catch(err => res.json({ status: 'error' }))
})

app.use('/add-cams-bookings', (req, res) => {
    const {name, email, phone, message} = req.body;

    camsEnquiryModel.create({
        name, email, phoneNumber: phone, message
    }).then(response => {
        res.json({ status: 'success' })
    }).catch(err => res.json({ status: 'network error' }))
})


app.post('/add-booking', async (req, res) => {
    const { service, authCode, packagePrice, totalPrice, deposit, bikeDetails, firstName, lastName, email, phone, date, due } = req.body;

    const existUser = await bookingModel.findOne({ email });

    if (existUser) return res.json({ status: 'booking exist' });

    try {
        await bookingModel.create({
            service, authCode, packagePrice, totalPrice, deposit, bikeDetails, firstName, lastName, email, phone, date, due
        }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
    } catch (error) {
        res.json({ status: 'network error' })
    }
})

app.post('/add-anyway', async (req, res) => {
    const { service, authCode, packagePrice, totalPrice, deposit, bikeDetails, firstName, lastName, email, phone, date, due } = req.body;
    
    try {
        await bookingModel.create({
            service, authCode, packagePrice, totalPrice, deposit, bikeDetails, firstName, lastName, email, phone, date, due
        }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
    } catch (error) {
        res.json({ status: 'network error' })
    }
})

app.post('/apply-job', async (req, res) => {
    const { email, status } = req.body;
    const jobContent = await bookingModel.findOne({ email })
    jobContent.status = status;

    bookingModel.collection.updateOne({email}, {$set: jobContent}).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
})

app.post('/complete-job', async (req, res) => {
    const { email, status } = req.body;
    const jobContent = await bookingModel.findOne({ email })

    jobContent.status = status;

    bookingModel.collection.updateOne({email}, {$set: jobContent}).then(response => {
        const { matchedCount, modifiedCount } = response
        if (matchedCount > 0 && modifiedCount > 0){
            console.log(response)
            return res.json({ status: 'success' })
        }
    }).catch(err => res.json({ status: 'error' }))
})

app.post('/delete-job', async (req, res) => {
    const { email } = req.body;
    const jobContent = await bookingModel.findOne({ email })

    if (!jobContent) return res.json({ status: 'booking not found' })

    bookingModel.collection.deleteOne({email}).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
})

app.use('/xiaomi-query', (req, res) => {
    xiaomiModel.find({}).then(response => res.json({ status: 'success', data: response })).catch(err => res.json({ status: 'error' }))
})

app.use('/add-xiaomi-booking', (req, res) => {
    const {service, date, name, email, phone} = req.body;

    xiaomiModel.create({
        service, date, name, email, phone
    }).then(response => res.json({ status: 'success' })).catch(err => res.json({ status: 'error' }))
})

const port = process.env.PORT

app.listen(port || '8000', (err) => {
    if (!err)
        console.log('server listening on port 8000');
    else console.log(err);
})