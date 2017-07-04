#!/usr/bin/env node
const ECSData = require('./lib/ecs-data');
const argv = require('minimist')(process.argv.slice(2));

const clusterName = argv.cluster;
if (!clusterName) {
  console.log('--cluster is required');
  return;
}

const serviceName = argv.service;
if (!serviceName) {
  console.log('--service is required');
  return;
}
const desiredCount = argv.desiredCount ? argv.desiredCount : 1;
const serviceCopyName = argv.serviceCopyName ? argv.serviceCopyName : `${serviceName}-Copy`;

const serviceParams = {
  clusterName,
  serviceName,
};


ECSData.getService(serviceParams)
    .then(serviceData => new Promise((resolve, reject) => {
        // Ensure the service name being copied doesn't already exist
      const serviceCopyParams = {
        clusterName,
        serviceName: serviceCopyName,
      };
      ECSData.getService(serviceCopyParams)
        .then((serviceCopyData) => {
          if (serviceCopyData === null || (serviceCopyData.desiredCount === 0 && serviceCopyData.runningCount === 0)) {
            resolve(serviceData);
            return;
          }
          console.log(serviceCopyData);
          reject('Service Already Exists');
        })
        .catch((err) => {
          resolve(serviceData);
        });
    }))
    .then(service => ECSData.copyService({ serviceCopyName, service, desiredCount, clusterName }))
    .then((data) => {
      console.log(data);
      console.log('Service Successfully Copied');
    })
    .catch((err) => {
      console.log(err);
    });
