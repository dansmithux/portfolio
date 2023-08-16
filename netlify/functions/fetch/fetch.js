const fetch = require('node-fetch')

// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure

const accountSid = process.env.TWILIO_ACCOUNT_SID;

const authToken = process.env.TWILIO_AUTH_TOKEN;

const handler = async function (event, context, callback) {

  try {

    const phoneNumber = event.queryStringParameters.phoneNumber;

    const lookupUrl = `https://lookups.twilio.com/v2/PhoneNumbers/${encodeURIComponent(phoneNumber)}?Type=carrier&Fields=caller_name,line_type_intelligence`;

    const headers = new fetch.Headers({
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`
    });

    const response = await fetch(lookupUrl, { headers });
    const phoneNumberData = await response.json();

    console.log(phoneNumberData.carrier);

    return {
      statusCode: 200,
      body: JSON.stringify({ result: phoneNumberData }),
    };
  } catch (error) {
    console.error('Error:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

module.exports = { handler };
