import { CfnParameter, Fn } from 'aws-cdk-lib';
import { ITopic, Topic } from 'aws-cdk-lib/aws-sns';
import { EmailSubscription } from 'aws-cdk-lib/aws-sns-subscriptions';
import { Construct } from 'constructs';

export class coSns extends Construct {
  public topic: ITopic;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const emails = new CfnParameter(this, 'notification-emails', {
      description: 'Email addresses to send notifications to (comma separated)',
      type: 'String',
    });

    this.topic = new Topic(this, 'car-outlet-newCars', { displayName: 'Car outlet new cars topic' });

    emails.valueAsString.split(',').forEach((email) => {
      this.topic.addSubscription(new EmailSubscription(email.trim()));
    });
  }
}
