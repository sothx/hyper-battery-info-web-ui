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
export function useRealQuantity() {
	const osThemeRef = useOsTheme()
	const configProviderPropsRef = computed(() => ({
		theme: osThemeRef === 'dark' ? darkTheme : lightTheme
	}))

	const { message, modal } = createDiscreteApi(['message', 'modal'], {
		configProviderProps: configProviderPropsRef,
	});


	const qcomBatteryFg1RSocInfo = reactive({
		current: 0,
		autoReload: false,
		timer: 3,
		reload: async() => {
			const [, getQcomBatteryFg1RSocRes] = await $to(deviceApi.getQcomBatteryFg1RSoc());
			if (getQcomBatteryFg1RSocRes) {
				qcomBatteryFg1RSocInfo.current = Number(getQcomBatteryFg1RSocRes);
			}
		},
		interval: null
	})

	const capacityRawInfo = reactive({
		current: 0,
		autoReload: false,
		timer: 3,
		reload: async() => {
			const [, getQcomBatteryFg1RSocRes] = await $to(deviceApi.getQcomBatteryFg1RSoc());
			if (getQcomBatteryFg1RSocRes) {
				qcomBatteryFg1RSocInfo.current = Number(getQcomBatteryFg1RSocRes);
			}
		},
		interval: null
	})

	const setupAutoReload = (info) => {
		// Clear the existing interval if any
		if (info.interval) {
			clearInterval(info.interval);
			info.interval = null;
		}

		// Set a new interval if autoReload is true
		if (info.autoReload) {
			info.interval = setInterval(() => {
				info.reload();
			}, info.timer * 1000);
		}
	};

	watchEffect(() => setupAutoReload(qcomBatteryFg1RSocInfo));
	watchEffect(() => setupAutoReload(capacityRawInfo));

	onMounted(async () => {
        qcomBatteryFg1RSocInfo.reload()
		capacityRawInfo.reload()
	});

	onUnmounted(() => {
		// Clear intervals when the component is unmounted
		if (qcomBatteryFg1RSocInfo.interval !== null) clearInterval(qcomBatteryFg1RSocInfo.interval);
		if (capacityRawInfo.interval !== null) clearInterval(capacityRawInfo.interval);
	});

	return {
		qcomBatteryFg1RSocInfo,
		capacityRawInfo
	};
}