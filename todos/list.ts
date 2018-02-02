'use strict';

import * as AWS from 'aws-sdk';
import {APIGatewayEvent, Callback, Context} from "aws-lambda";

const dynamoDb = new AWS.DynamoDB.DocumentClient();
const params = {
    TableName: process.env.DYNAMODB_TABLE as string
};

export function listTodos(event: APIGatewayEvent, context: Context, callback: Callback) {
    // fetch all todos from the database
    dynamoDb.scan(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'Couldn\'t fetch the todos.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Items),
        };
        callback(null, response);
    });
}
