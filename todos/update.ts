'use strict';

import * as AWS from 'aws-sdk';
import {APIGatewayEvent, Callback, Context} from "aws-lambda";

const dynamoDb = new AWS.DynamoDB.DocumentClient();

export function updateTodo(event: APIGatewayEvent, context: Context, callback: Callback) {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body || '');

    // validation
    if (typeof data.text !== 'string' || typeof data.checked !== 'boolean') {
        console.error('Validation Failed');
        callback(null, {
            statusCode: 400,
            headers: {'Content-Type': 'text/plain'},
            body: 'Couldn\'t update the todo item.',
        });
        return;
    }

    const params = {
        TableName: process.env.DYNAMODB_TABLE as string,
        Key: {
            id: event.pathParameters ? event.pathParameters.id : '',
        },
        ExpressionAttributeNames: {
            '#todo_text': 'text',
        },
        ExpressionAttributeValues: {
            ':text': data.text,
            ':checked': data.checked,
            ':updatedAt': timestamp,
        },
        UpdateExpression: 'SET #todo_text = :text, checked = :checked, updatedAt = :updatedAt',
        ReturnValues: 'ALL_NEW',
    };

    // update the todo in the database
    dynamoDb.update(params, (error, result) => {
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
            body: JSON.stringify(result.Attributes),
        };
        callback(null, response);
    });
}
