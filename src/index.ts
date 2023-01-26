import { GetItemCommand, PutItemCommand } from '@aws-sdk/client-dynamodb';
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
      'sec-fetch-site': 'cross-site'
    },
    referrer: 'https://www.athloncaroutlet.es/',
    referrerPolicy: 'strict-origin-when-cross-origin',
    body: '{"pagination":{"pageNumber":1,"pageSize":8000},"sorts":[{"field":"makeModel","direction":"ASC"}],"query":"","queryGroups":[{"concatenator":"AND","queryParts":[{"field":"transmissionType","values":["Automatic"]}]}]}',
    method: 'POST'
  });

  if (!response.ok) {
    throw new Error(response.statusText);
  }

  const data = await response.json();
  return data as Response;
}

async function existCar(car: Car): Promise<boolean> {
  const command = new GetItemCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: marshall({ actionModelCode: car.actionModelCode })
  });

  const { Item } = await ddbClient.send(command);
  return !!Item;
}

async function saveCarData(car: Car): Promise<void> {
  const command = new PutItemCommand({
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: marshall(car || {})
  });

  await ddbClient.send(command);
}

async function saveCar(car: Car): Promise<void> {
  const exist = await existCar(car);

  if (exist) {
    console.log(`Car ${car.versionUrl} already exists`);
    return;
  }

  await saveCarData(car);
  console.log(`Car ${car.versionUrl} saved`);
}

async function saveCars(response: Response) {
  const cars = response.versions;

  if (!cars.length) {
    console.log('No new cars found');
    return;
  }

  for (const car of cars) {
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
