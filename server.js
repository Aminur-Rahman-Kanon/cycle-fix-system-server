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

app.post('/bookings', async (req, res) => {
    bookingModel.find({}).then(response => {
        const filteredDates = response.sort((a, b) => new Date(a.date) - new Date(b.date));
        const test1 = {};
        let index = 0;
        filteredDates.map(item => {
            const date = item.date.split(' ').slice(1).join(' ');
            if (test1.hasOwnProperty(date)){
                index ++;
                test1[date][index] = item;
            }
            else {
                test1[date] = {};
                index = 0;
                test1[date][index] = item;
            }
        })
        res.json({ status: 'success', data:test1 });
    
    })
    .catch(err => res.json({ status: 'error' }));
})

// app.listen('8000', () => {
//     console.log('server running on port 8000');
// })

const port = process.env.PORT

app.listen(port || '8000', (err) => {
    if (!err)
        console.log('server listening on port 8000');
    else console.log(err);
})