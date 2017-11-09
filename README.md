# ecs-copy-service

Command line tool to copy an AWS ECS service to another service with the same name. Ideal for creating a 'canary service' to run against the same ELB/Target group. All properties of the service will be copied except the name.

## Example

```
$ ecs-copy-service --cluster my-ecs-cluster --service my-ecs-service --serviceCopyName my-ecs-service-copy
```
## AWS Region

The AWS region is not hard-coded in the code, you need to specify it using the `AWS_REGION` environment variable.
