const awsServerlessExpress = require('aws-serverless-express');
const app = require('./app');

/**
 * @type {import('http').Server}
 */
const server = awsServerlessExpress.createServer(app);

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb');

const client = new DynamoDBClient();

exports.handler = async (event) => {
    try {
        const formData = JSON.parse(event.body);
        const { name, grade, school, parentemail, studentemail } = formData;
        /*console.log('Name:' + name);
        console.log('Grade:' + grade);
        console.log('School:' + school);
        console.log('parentemail:' + parentemail);
        console.log('studentemail:' + studentemail);*/
        const params = {
            TableName: 'partinfo-dev',
            Item: {
                name: { S: name },
                grade: { S: grade },
                school: { S: school },
                parentemail: { S: parentemail },
                studentemail: { S: studentemail },
                createdAt: { S: new Date().toISOString() },
            },
        };

        const command = new PutItemCommand(params);
        await client.send(command);

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Data inserted successfully!',
                data: formData,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    } catch (error) {
        console.error('Error processing form data:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Internal Server Error',
                message: 'There was an error processing the form data.',
            }),
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        };
    }
};

