import './style.css'
import { isTauri } from "@tauri-apps/api/core";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { createApp } from "vue";
import App from "./App.vue";

createApp(App).mount("#app");

if (isTauri()) {
	// 全局全屏快捷键
	addEventListener('keydown', async (e) => {
		if (e.key !== 'F11' || e.repeat) return
		e.preventDefault()
		const win = getCurrentWindow()
		win.setFullscreen(!(await win.isFullscreen()))
	})
	// 等待页面加载完成再显示窗口
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
