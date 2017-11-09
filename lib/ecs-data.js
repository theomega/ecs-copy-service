const AWS = require('aws-sdk');

const ecs = new AWS.ECS();

class ECSData {
  static getService({ clusterName, serviceName }) {
    return new Promise((resolve, reject) => {
      const params = {
        cluster: clusterName,
        services: [
          serviceName,
        ],
      };

      ecs.describeServices(params, (err, data) => {
        if (err) {
          reject(err);
          return;
        }
        if (data && data.services && data.services.length > 0) {
          resolve(data.services[0]);
        } else {
          // not found
          resolve(null);
        }
      });
    });
  }

  static copyService({ serviceCopyName, service, desiredCount = 1, clusterName }) {
    return new Promise((resolve, reject) => {
      const newServiceParams = {
        desiredCount,
        serviceName: serviceCopyName,
        taskDefinition: service.taskDefinition,
        cluster: clusterName,
        deploymentConfiguration: service.deploymentConfiguration,
        loadBalancers: service.loadBalancers,
        placementConstraints: service.placementConstraints,
        placementStrategy: service.placementStrategy,
        role: service.roleArn,
      };

      ecs.createService(newServiceParams, (err, data) => {
        if (err) {
          reject(err);
        }

        resolve(data);
      });
    });
  }
}

module.exports = ECSData;
