// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
use std::{
    fs,
    path::{Path, PathBuf},
    sync::Mutex,
};
use tauri::{Emitter, Manager, State, Theme, window::Color};

struct PendingFiles(Mutex<Vec<String>>);

fn markdown_path(path: String, working_directory: &str) -> Option<String> {
    let path = PathBuf::from(path);
    if !path.extension().is_some_and(|extension| extension.eq_ignore_ascii_case("md")) {
        return None;
    }

    let path = if path.is_absolute() {
        path
    } else {
        Path::new(working_directory).join(path)
    };
    Some(path.to_string_lossy().into_owned())
}

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

#[tauri::command]
fn take_pending_files(files: State<'_, PendingFiles>) -> Vec<String> {
    files.0.lock().map(|mut files| std::mem::take(&mut *files)).unwrap_or_default()
}

#[tauri::command]
fn read_markdown_file(path: String) -> Result<String, String> {
    if !Path::new(&path).extension().is_some_and(|extension| extension.eq_ignore_ascii_case("md")) {
        return Err("Only Markdown (.md) files can be opened".into());
    }
    fs::read_to_string(path).map_err(|error| error.to_string())
}

#[tauri::command]
fn write_markdown_file(path: String, content: String) -> Result<(), String> {
    if !Path::new(&path).extension().is_some_and(|extension| extension.eq_ignore_ascii_case("md")) {
        return Err("Only Markdown (.md) files can be saved".into());
    }
    fs::write(path, content).map_err(|error| error.to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    let working_directory = std::env::current_dir().unwrap_or_default();
    let initial_files = std::env::args_os()
        .skip(1)
        .filter_map(|argument| markdown_path(argument.to_string_lossy().into_owned(), &working_directory.to_string_lossy()))
        .collect();

    tauri::Builder::default()
        .manage(PendingFiles(Mutex::new(initial_files)))
        .plugin(tauri_plugin_single_instance::init(|app, arguments, working_directory| {
            let files = arguments.into_iter().skip(1).filter_map(|argument| markdown_path(argument, &working_directory));
            if let Some(window) = app.get_webview_window("main") {
                let _ = window.show();
                let _ = window.set_focus();
            }
            if let Some(pending) = app.try_state::<PendingFiles>() {
                if let Ok(mut queue) = pending.0.lock() {
                    queue.extend(files);
                }
            }
            let _ = app.emit("markdown-open-request", ());
        }))
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
        .invoke_handler(tauri::generate_handler![
            greet,
            take_pending_files,
            read_markdown_file,
            write_markdown_file
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
