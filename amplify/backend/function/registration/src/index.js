const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
    try {
        // Parse the stringified form data from the event body
        const formData = JSON.parse(event.body);

        const { name, grade, school, parentemail, studentemail } = formData;

        // Log the data to the console (optional)
        console.log('Received form data:', formData);

        // Define the parameters for DynamoDB
        const params = {
            TableName: 'partinfo-dev', // Replace with your DynamoDB table name
            Item: {
                name: name,
                grade: grade,
                school: school,
                parentemail: parentemail,
                studentemail: studentemail,
                createdAt: new Date().toISOString(), // Optional: track the creation time
            },
        };

        // Write the data to DynamoDB
        await dynamoDb.put(params).promise();

        // Create the response object
        const response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Data inserted successfully!',
                data: formData,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Enable CORS if needed
            },
        };

        return response;

    } catch (error) {
        console.error('Error processing form data:', error);

        // Return an error response
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal Server Error',
                message: 'There was an error processing the form data.',
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*', // Enable CORS if needed
            },
        };
    }
};
