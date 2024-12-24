import {
    exec
  } from '../assets/kernelsu/index.js';
import webConfig from '../web.config.js'
export const getQcomBatteryFg1RSoc = () => {
	const shellCommon = `cat /sys/class/qcom-battery/fg1_rsoc`;
	return new Promise(async (resolve, reject) => {
        if (webConfig.env === 'dev') {
            resolve(`90`);
        } else {
            const { errno, stdout, stderr } = await exec(shellCommon);
            errno ? reject(stderr) : stdout === 'null' ? resolve('') : resolve(stdout);
        }
    })
};

export const getBatterySohQcom = () => {
	const shellCommon = `cat /sys/class/qcom-battery/soh`;
	return new Promise(async (resolve, reject) => {
        if (webConfig.env === 'dev') {
            resolve(`90`);
        } else {
            const { errno, stdout, stderr } = await exec(shellCommon);
            errno ? reject(stderr) : stdout === 'null' ? resolve('') : resolve(stdout);
        }
    })
};

export const getBatterySohMTK = () => {
	const shellCommon = `cat /sys/class/power_supply/bms/soh`;
	return new Promise(async (resolve, reject) => {
        if (webConfig.env === 'dev') {
            resolve(`90`);
        } else {
            const { errno, stdout, stderr } = await exec(shellCommon);
            errno ? reject(stderr) : stdout === 'null' ? resolve('') : resolve(stdout);
        }
    })
};

export const getBatteryChargeFullDesign = () => {
	const shellCommon = `cat /sys/class/power_supply/battery/charge_full_design`;
	return new Promise(async (resolve, reject) => {
        if (webConfig.env === 'dev') {
            resolve(`8600000`);
        } else {
            const { errno, stdout, stderr } = await exec(shellCommon);
            errno ? reject(stderr) : stdout === 'null' ? resolve('') : resolve(stdout);
        }
    })
};

export const getBatteryChargeFull = () => {
	const shellCommon = `cat /sys/class/power_supply/battery/charge_full`;
	return new Promise(async (resolve, reject) => {
        if (webConfig.env === 'dev') {
            resolve(`7785000`);
        } else {
            const { errno, stdout, stderr } = await exec(shellCommon);
            errno ? reject(stderr) : stdout === 'null' ? resolve('') : resolve(stdout);
        }
    })
};

export const getBatteryCycleCount = () => {
	const shellCommon = `cat /sys/class/power_supply/battery/cycle_count`;
	return new Promise(async (resolve, reject) => {
        if (webConfig.env === 'dev') {
            resolve(`338`);
        } else {
            const { errno, stdout, stderr } = await exec(shellCommon);
            errno ? reject(stderr) : stdout === 'null' ? resolve('') : resolve(stdout);
        }
    })
};
