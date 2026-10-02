import './style.css'
import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");

if (isTauri()) {
	let shown = false;
	const showWindow = () => {
		if (shown) return;
		shown = true;
		getCurrentWindow().show();
	};

	requestAnimationFrame(() => {
		requestAnimationFrame(showWindow);
	});
}
