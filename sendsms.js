const accountSid = 'AC218d0d10fed91213da0c5317ac01e6c8'
const authToken = '4dd3acddda5605a6c514869c33c5d8f1'

const client = require('twilio')(accountSid, authToken);

client.messages.create({

    to: '+12537539783',
    from: '+12512999122',
    body: 'Hello'

})

.then((message) => console.log(message.sid));