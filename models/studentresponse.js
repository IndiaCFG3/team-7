const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const studentresponseSchema = new Schema({
    array:[[String]]
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt'
    }
});

const Response = mongoose.model('studentResponse', studentresponseSchema);
module.exports = Response;
