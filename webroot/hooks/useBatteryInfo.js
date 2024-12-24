import $to from '../assets/await-to-js.js';
import * as deviceApi from '../apis/deviceApi.js';
const {
	createApp,
	ref,
	watchEffect,
	onMounted,
	computed,
	reactive,
	onUnmounted
  } = Vue;
  const {
	useOsTheme,
	darkTheme,
	lightTheme,
	createDiscreteApi
  } = naive;
export function useBatteryInfo() {
	const osThemeRef = useOsTheme()
	const configProviderPropsRef = computed(() => ({
		theme: osThemeRef === 'dark' ? darkTheme : lightTheme
	}))

	const { message, modal } = createDiscreteApi(['message', 'modal'], {
		configProviderProps: configProviderPropsRef,
	});

    const sohQcom = ref(0);

    const sohMTK = ref(0);

    const chargeFullDesign = ref(0);

    const chargeFull = ref(0);

    const cycleCount = ref(0);

    async function initDefault() {
        const executeWithoutWaiting = [
            // 售后电池健康度
            $to(deviceApi.getBatterySohQcom()),
            $to(deviceApi.getBatterySohMTK()),
            // 电池设计容量
            $to(deviceApi.getBatteryChargeFullDesign()),
            // 当前电池容量
            $to(deviceApi.getBatteryChargeFull()),
            // 电池循环次数
            $to(deviceApi.getBatteryCycleCount()),
        ];
        // 等待所有 promises 完成
        const executeWithoutWaitingResults = await Promise.all(executeWithoutWaiting);
        const [
            [, getBatterySohQcomRes],
            [, getBatterySohMTKRes],
            [, getBatteryChargeFullDesignRes],
            [, getBatteryChargeFullRes],
            [, getBatteryCycleCountRes],
        ] = executeWithoutWaitingResults;
        // 售后电池健康度
        sohQcom.value = Number(getBatterySohQcomRes)
        sohMTK.value = Number(getBatterySohMTKRes)
        // 电池设计容量
        chargeFullDesign.value = Number(getBatteryChargeFullDesignRes)
        // 当前电池容量
        chargeFull.value = Number(getBatteryChargeFullRes)
        // 当前电池循环次数
        cycleCount = Number(getBatteryCycleCountRes)
    }


	onMounted(async () => {
        initDefault()
	});

	return {
        sohQcom,
        sohMTK,
        chargeFullDesign,
        chargeFull,
        cycleCount
	};
}