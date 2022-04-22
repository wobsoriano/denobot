import { byteType } from "../deps.ts";
import { library } from "./ffi.ts";

type ResultAndError = {
  result: string;
  error: string;
};

const Point = new byteType.Struct({
  x: byteType.i32,
  y: byteType.i32,
});

const ResultAndErrorStruct = new byteType.Struct({
  result: new byteType.PointerValue(byteType.cstring),
  error: new byteType.PointerValue(byteType.cstring),
});

export function freePointer(ptr: Deno.UnsafePointer) {
  library.symbols.free_string(ptr);
}

export function stringToPointer(cstr: string): Deno.UnsafePointer {
  const buffer = new Uint8Array([...new TextEncoder().encode(cstr), 0]);
  return Deno.UnsafePointer.of(buffer);
}

export function toCString(ptr: Deno.UnsafePointer, freePtr = true): string {
  if (ptr.value === 0n) {
    return "";
  }
  const ptrView = new Deno.UnsafePointerView(ptr);
  const str = ptrView.getCString();
  if (freePtr) {
    freePointer(ptr);
  }
  return str;
}

function combineArgs(args: string[]) {
  return args.join(",");
}

export function getVersion() {
  return toCString(library.symbols.get_version());
}

// Screen

export function getPixelColor() {
  return toCString(library.symbols.get_pixel_color());
}

export function getMouseColor() {
  return toCString(library.symbols.get_mouse_color());
}

/**
 * Get the screen size.
 */
export function getScreenSize() {
  const result = library.symbols.get_screen_size();
  const ptrView = new Deno.UnsafePointerView(result);
  const decoded = Point.read(ptrView, 0);
  freePointer(result);
  return decoded;
}

/**
 * Get the screen scale size.
 */
export function getScaleSize() {
  const result = library.symbols.get_scale_size();
  const ptrView = new Deno.UnsafePointerView(result);
  const decoded = Point.read(ptrView, 0);
  freePointer(result);
  return decoded;
}

// MOUSE

/**
 * Move the mouse to (x, y)
 */
export function move(x: number, y: number) {
  library.symbols.move(x, y);
}

/**
 * Drag the mouse like smooth to (x, y)
 */
export function dragSmooth(x: number, y: number, btn = "left") {
  const ptr = stringToPointer(btn);
  library.symbols.drag_smooth(x, y, ptr);
}

/**
 * Moves mouse to (x, y) human like, with the mouse button up.
 */
export function moveSmooth(x: number, y: number, low = 1.0, high = 3.0) {
  library.symbols.move_smooth(x, y, low, high);
}

/**
 * Gets the mouse Point.
 */
export function getMousePos() {
  const result = library.symbols.get_mouse_pos();
  const ptrView = new Deno.UnsafePointerView(result);
  const decoded = Point.read(ptrView, 0);
  freePointer(result);
  return decoded;
}

/**
 * Click the mouse button.
 */
export function click(btn = "left", double = false) {
  const ptr = stringToPointer(btn);
  library.symbols.click(ptr, Number(double));
}

/**
 * Toggles mouse button.
 */
export function toggle(key = "left", btn = "down") {
  const keyPtr = stringToPointer(key);
  const btnPtr = stringToPointer(btn);
  library.symbols.toggle(keyPtr, btnPtr);
}

/**
 * Scrolls the mouse in any direction.
 */
export function scroll(x: number, y: number) {
  library.symbols.scroll(x, y);
}

// KEYBOARD

/**
 * Tap the keyboard code.
 */
export function keyTap(key: string, ...modifiers: string[]) {
  const keyPtr = stringToPointer(key);
  const modifiersPtr = stringToPointer(combineArgs(modifiers));
  const resultPtr = library.symbols.key_tap(keyPtr, modifiersPtr);
  const error = toCString(resultPtr);
  if (error !== "") {
    throw new Error(error);
  }
}

/**
 * Toggle the keyboard.
 */
export function keyToggle(key: string, ...modifiers: string[]) {
  const keyPtr = stringToPointer(key);
  const modifiersPtr = stringToPointer(combineArgs(modifiers));
  const resultPtr = library.symbols.key_toggle(keyPtr, modifiersPtr);
  const error = toCString(resultPtr);
  if (error !== "") {
    throw new Error(error);
  }
}

/**
 * Type a string.
 */
export function typeStr(text: string) {
  const textPtr = stringToPointer(text);
  library.symbols.type_str(textPtr);
}

/**
 * Type a string delayed.
 */
export function typeStrDelayed(text: string, delay: number) {
  const textPtr = stringToPointer(text);
  library.symbols.type_str_delay(textPtr, delay);
}

/**
 * TODO: definition
 */
export function readAll(): string {
  const ptr = library.symbols.read_all();
  const unsafe = new Deno.UnsafePointerView(ptr);
  const { result, error } = ResultAndErrorStruct.read(unsafe) as ResultAndError;
  freePointer(ptr);

  if (error) {
    throw new Error(error);
  }

  return result;
}

/**
 * Write string to clipboard.
 */
export function writeAll(text: string) {
  const ptr = stringToPointer(text);
  const errPtr = library.symbols.write_all(ptr);
  const errPtrStr = toCString(errPtr);
  if (errPtrStr.length > 0) {
    throw new Error(errPtrStr);
  }
}

/**
 * Paste a string, support UTF-8, write the string to clipboard and tap `cmd + v`.
 */
export function pasteStr(text: string) {
  const ptr = stringToPointer(text);
  library.symbols.paste_str(ptr);
}

// WINDOW

/**
 * Show an alert message.
 */
export function showAlert(title: string, message: string) {
  const titlePtr = stringToPointer(title);
  const messagePtr = stringToPointer(message);
  const ptr = library.symbols.show_alert(titlePtr, messagePtr);
  return Boolean(ptr);
}

/**
 * Get the window title.
 */
export function getTitle(pid = -1) {
  const ptr = library.symbols.get_title(pid);
  return toCString(ptr);
}

/**
 * Get the window bounds.
 */
export function getBounds(pid: number) {
  const struct = new byteType.Struct({
    x: byteType.i32,
    y: byteType.i32,
    w: byteType.i32,
    h: byteType.i32
  });
  
  const ptr = library.symbols.get_bounds(pid);
  const ptrView = new Deno.UnsafePointerView(ptr);
  const decoded = struct.read(ptrView, 0);
  freePointer(ptr);
  return decoded;
}

/**
 * Determine whether the process exists.
 */
export function pidExists(pid: number) {
  const ptr = library.symbols.pid_exists(pid);
  const unsafe = new Deno.UnsafePointerView(ptr);
  const { result, error } = ResultAndErrorStruct.read(unsafe) as ResultAndError;
  freePointer(ptr);

  if (error) {
    throw new Error(error);
  }

  return result === "true";
}

/**
 * Finds all processes named with a subset of "name" (case insensitive).
 */
export function findIds(name: string) {
  const namePtr = stringToPointer(name);
  const ptr = library.symbols.find_ids(namePtr);
  const unsafe = new Deno.UnsafePointerView(ptr);
  const { result, error } = ResultAndErrorStruct.read(unsafe) as ResultAndError;
  freePointer(ptr);

  if (error) {
    throw new Error(error);
  }

  return result.split(" ");
}
