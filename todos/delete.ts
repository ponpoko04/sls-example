'use strict';

import * as AWS from 'aws-sdk';
import {APIGatewayEvent, Callback, Context} from "aws-lambda";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function deleteTodo(event: APIGatewayEvent, context: Context, callback: Callback) {
    const params = {
        TableName: process.env.DYNAMODB_TABLE as string,
        Key: {
            id: event.pathParameters ? event.pathParameters.id : '',
        },
    };

    // delete the todo from the database
    dynamoDb.delete(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'Couldn\'t remove the todo item.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify({}),
        };
        callback(null, response);
    });
}
