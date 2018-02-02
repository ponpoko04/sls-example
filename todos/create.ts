'use strict';

import * as uuid from 'uuid';
import * as AWS from 'aws-sdk';
import {APIGatewayEvent, Callback, Context} from "aws-lambda";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function createTodo(event: APIGatewayEvent, context: Context, callback: Callback) {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body || '');
    if (typeof data.text !== 'string') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: {'Content-Type': 'text/plain'},
            body: 'Couldn\'t create the todo item.',
        });
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE as string,
        Item: {
            id: uuid.v1(),
            text: data.text,
            checked: false,
            createdAt: timestamp,
            updatedAt: timestamp,
        },
    };

    // write the todo to the database
    dynamoDb.put(params, (error) => {
        // handle potential errors
        if (error) {
            console.error(error);
            callback(null, {
                statusCode: error.statusCode || 501,
                headers: {'Content-Type': 'text/plain'},
                body: 'Couldn\'t create the todo item.',
            });
            return;
        }

        // create a response
        const response = {
            statusCode: 200,
            body: JSON.stringify(params.Item),
        };
        callback(null, response);
    });
}
