use tauri::{Manager, Theme};
use tauri::window::Color;

fn chrome_color(theme: Result<Theme, tauri::Error>) -> Color {
  match theme {
    Ok(Theme::Light) => Color(0xf3, 0xf3, 0xf3, 255),
    _ => Color(0x20, 0x20, 0x20, 255),
  }
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  tauri::Builder::default()
    .setup(|app| {
      if let Some(win) = app.get_webview_window("main") {
        let _ = win.set_background_color(Some(chrome_color(win.theme())));
      }
      if cfg!(debug_assertions) {
        app.handle().plugin(
          tauri_plugin_log::Builder::default()
            .level(log::LevelFilter::Info)
            .build(),
        )?;
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
