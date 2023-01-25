import { RemovalPolicy } from 'aws-cdk-lib';
import { AttributeType, BillingMode, ITable, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';

export class coDatabase extends Construct {
  public readonly table: ITable;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    this.table = new Table(this, 'outletcars', {
      partitionKey: {
        name: 'versionUrl',
        type: AttributeType.STRING
      },
      sortKey: {
        name: 'offeredSince',
        type: AttributeType.STRING
      },
      tableName: 'outletcars',
      removalPolicy: RemovalPolicy.DESTROY,
      billingMode: BillingMode.PAY_PER_REQUEST
    });
  }
}
