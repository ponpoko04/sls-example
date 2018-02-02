'use strict';

import * as AWS from 'aws-sdk';
import {APIGatewayEvent, Callback, Context} from "aws-lambda";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function getTodo(event: APIGatewayEvent, context: Context, callback: Callback) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE as string,
        Key: {
            id: event.pathParameters ? event.pathParameters.id : '',
        },
    };

    // fetch todo from the database
    dynamoDb.get(params, (error, result) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'Couldn\'t fetch the todo item.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(result.Item),
        };
        callback(null, response);
    });
}
