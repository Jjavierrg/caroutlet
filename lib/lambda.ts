import { ITable } from 'aws-cdk-lib/aws-dynamodb';
import { Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';

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
        PRIMARY_KEY: 'userName',
        SORT_KEY: 'orderDate',
        DYNAMODB_TABLE_NAME: table.tableName,
        URL: 'https://www.chevrolet.com/vehicles/corvette-c8-stingray/'
      },
      runtime: Runtime.NODEJS_14_X,
      description: 'Lambda function to scrape new cars from the website',
      functionName: 'caroutlet-scrapper'
    };

    const func = new NodejsFunction(this, 'orderingLambdaFunction', {
      entry: join(__dirname, `/../src/index.ts`),
      ...nodeJsFunctionProps
    });

    table.grantReadWriteData(func);
  }
}
