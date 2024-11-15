import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import awsServerlessExpress from 'aws-serverless-express';
import app from './app.js';

/**
 * Create the DynamoDB Document Client with AWS SDK v3
 */
const dynamoDbClient = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(dynamoDbClient);

/**
 * Create server for AWS Serverless Express
 */
const server = awsServerlessExpress.createServer(app);

export const handler = async (event) => {
    try {
        // Parse the stringified form data from the event body
        const formData = JSON.parse(event.body);
        const { studentID, name, grade, school, parentemail, studentemail } = formData;

        // Log the data to the console (optional)
        console.log('Received form data:', formData);

        // Define the parameters for DynamoDB
        const params = {
            TableName: 'participants-dev', // Replace with your DynamoDB table name
            Item: {
                studentID: studentID,
                name: name,
                grade: grade,
                school: school,
                parentemail: parentemail,
                studentemail: studentemail,
            },
        };

        // Write the data to DynamoDB
        await dynamoDb.send(new PutCommand(params));

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
