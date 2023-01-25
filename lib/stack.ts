import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { coDatabase } from './database';
import { coLambda } from './lambda';

export class coStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const database = new coDatabase(this, 'Database');
    const lambda = new coLambda(this, 'Microservices', database.table);
  }
}
