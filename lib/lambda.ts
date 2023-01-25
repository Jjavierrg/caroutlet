import { Duration } from 'aws-cdk-lib';
import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Rule, Schedule } from 'aws-cdk-lib/aws-events';
import { LambdaFunction } from 'aws-cdk-lib/aws-events-targets';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import events = require('events');

export class coLambda extends Construct {
  constructor(scope: Construct, id: string, table: ITable) {
    super(scope, id);

    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk' // Use the 'aws-sdk' available in the Lambda runtime
        ]
      },
      environment: {
        PRIMARY_KEY: 'versionUrl',
        SORT_KEY: 'offeredSince',
        DYNAMODB_TABLE_NAME: table.tableName,
        URL: 'https://services.athlon.com/api/irt/secured/employee/athloncaroutletes/version/search'
      },
      runtime: Runtime.NODEJS_18_X,
      description: 'Lambda function to scrape new cars from the website',
      functionName: 'caroutlet-scrapper'
    };

    const func = new NodejsFunction(this, 'caroutlet-scrapper', {
      entry: join(__dirname, `/../src/index.ts`),
      ...nodeJsFunctionProps
    });

    const eventRule = new Rule(this, 'scheduleRule', {
      schedule: Schedule.rate(Duration.hours(1))
    });
    eventRule.addTarget(new LambdaFunction(func));

    table.grantReadWriteData(func);
  }
}
