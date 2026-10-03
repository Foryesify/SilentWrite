// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use tauri::{Manager, Theme, window::Color};

fn update_window_background(
    set_background_color: impl FnOnce(Option<Color>) -> tauri::Result<()>,
    theme: Theme,
) {
    let color = match theme {
        Theme::Light => Color(244, 244, 244, 255),
        Theme::Dark => Color(32, 32, 32, 255),
        _ => Color(244, 244, 244, 255),
    };

    if let Err(error) = set_background_color(Some(color)) {
        eprintln!("Failed to update window background color: {error}");
    }
}

#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            if let Some(window) = app.get_webview_window("main") {
                if let Ok(theme) = window.theme() {
                    update_window_background(|color| window.set_background_color(color), theme);
                }
            }
            Ok(())
        })
        .on_window_event(|window, event| {
            if let tauri::WindowEvent::ThemeChanged(theme) = event {
                update_window_background(|color| window.set_background_color(color), *theme);
            }
        })
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
