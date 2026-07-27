export const computeEngineEstimateConfig = {
  series: 'N1',
  machineType: 'n1-standard-1',
  operatingSystem: /Ubuntu Pro/,
  region: /Frankfurt.*europe-west3/,
  bootDiskSizeGiB: 100,
  instanceCount: 2,
};

export const expectedCosts = {
  n1Standard1Monthly: '$116.12',
  n1Standard2Monthly: '$207.73',
};
