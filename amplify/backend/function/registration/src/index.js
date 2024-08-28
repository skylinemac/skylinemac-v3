const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event) => {
  try {
      // Parse the stringified form data from the event body
      const formData = JSON.parse(event.body);

      const { name, email, message } = formData;

      // Log the data to the console (optional)
      console.log('Received form data:', formData);

      // Create the response object
      const response = {
          statusCode: 200,
          body: JSON.stringify({
              name: name,
              email: email,
              message: message
          }),
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', // Enable CORS if needed
          }
      };

      return response;

  } catch (error) {
      console.error('Error processing form data:', error);

      // Return an error response
      return {
          statusCode: 500,
          body: JSON.stringify({
              error: 'Internal Server Error',
              message: 'There was an error processing the form data.'
          }),
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*', // Enable CORS if needed
          }
      };
  }
};
