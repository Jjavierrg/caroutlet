import { PutItemCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { marshall } from '@aws-sdk/util-dynamodb';
import { ddbClient } from './ddbClient';
import { Car } from './models/car';
import { Response } from './models/response';

async function getData(): Promise<Response> {
  const url = process.env.URL!;
  const response = await fetch(url, {
    headers: {
      accept: '*/*',
      'content-type': 'application/json',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'cross-site',
    },
    referrer: 'https://www.athloncaroutlet.es/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: '{"pagination":{"pageNumber":1,"pageSize":8000},"sorts":[{"field":"makeModel","direction":"ASC"}],"query":"","queryGroups":[{"concatenator":"AND","queryParts":[{"field":"transmissionType","values":["Automatic"]}]}]}',
    method: 'POST',
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return data as Response;
}

async function filterNewCars(cars: Car[]): Promise<Car[]> {
  if (!cars?.length) {
    return [];
  }

  const keys: string[] = cars.map((car) => car.actionModelCode);
  const filterExpression = `actionModelCode IN (:${keys.join(', :')})`;
  const expressionAttributeValues = keys.reduce((acc: any, key: string) => {
    acc[`:${key}`] = key;
    return acc;
  }, {});

  const command = new ScanCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    ProjectionExpression: 'actionModelCode',
    FilterExpression: filterExpression,
    ExpressionAttributeValues: marshall(expressionAttributeValues),
  });

  const { Items } = await ddbClient.send(command);
  const newCars = cars.filter((car) => !Items?.some((item) => item.actionModelCode.S === car.actionModelCode));
  console.log(`Found ${newCars.length} new cars`);

  return newCars;
}

async function saveCar(car: Car): Promise<void> {
  const command = new PutItemCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: marshall(car || {}),
  });

  await ddbClient.send(command);

  console.log(`Saved car ${car.actionModelCode}`);
}

async function saveCars(response: Response) {
  const cars = response.versions;
  const newCars = await filterNewCars(cars);

  if (!newCars.length) {
    console.log('No new cars found');
    return;
  }

  for (const car of newCars) {
    await saveCar(car);
  }
}

export async function handler() {
  try {
    console.log('Running...');
    const data = await getData();
    await saveCars(data);
    console.log('Done');
  } catch (error) {
    console.error(JSON.stringify(error));
  }
}
