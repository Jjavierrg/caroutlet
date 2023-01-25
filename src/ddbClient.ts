// Create service client module using ES6 syntax.
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';

export const ddbClient = new DynamoDBClient({});
