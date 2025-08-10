import config from"../lib/config";
const log = (...args) => {
  if (config?.logger) {
    console.log(...args);
  }
};

export default log;