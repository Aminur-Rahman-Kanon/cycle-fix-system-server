const testimonialSchema = {
    comment: {type: String, required: true},
    name: {type: String, required: true},
    rating: {type: 'Number', required: true}
}

const camsEnquirySchema = {
    name : {type: String, required: true},
    email : {type: String, required: true},
    message: {type: String, required: true},
    phoneNumber : {type: String, required: true}
}

const registrationSchema = {
    firstName: String,
    lastName: String,
    email: String,
    user: String,
    password: String
}

const contactQuerySchema = {
    name: String,
    phone: String,
    email: String,
    message: String
}

const bookingSchema = {
    service: String,
    date: String,
    packagePrice: String,
    totalPrice: String,
    paymentStatus: String,
    authCode: String,
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    bikeDetails: Object

}

const xiaomiQuery = {
    service: String,
    price: String
}

module.exports = {
    testimonialSchema,
    camsEnquirySchema,
    registrationSchema,
    contactQuerySchema,
    bookingSchema,
    xiaomiQuery
}