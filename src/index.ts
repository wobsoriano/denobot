import { byteType } from "../deps.ts";
import { library } from "./ffi.ts";

const Coordinates = new byteType.Struct({
  x: byteType.i32le,
  y: byteType.i32le
});

export function freePointer(ptr: Deno.UnsafePointer) {
  library.symbols.free_string(ptr)
}

export function stringToPointer(cstr: string): Deno.UnsafePointer {
  const buffer = new Uint8Array([...new TextEncoder().encode(cstr), 0]);
  return Deno.UnsafePointer.of(buffer);
}

export function toCString(ptr: Deno.UnsafePointer): string {
  if (ptr.value === 0n) {
    return "";
  }
  const unsafe = new Deno.UnsafePointerView(ptr);
  const str = unsafe.getCString();
  freePointer(ptr);
  return str;
}

function combineArgs(args: string[]) {
  return args.join(',')
}

export function getVersion() {
  return toCString(library.symbols.get_version())
}

// Screen

export function getPixelColor() {
  return toCString(library.symbols.get_pixel_color())
}

export function getMouseColor() {
  return toCString(library.symbols.get_mouse_color())
}

export function getScreenSize() {
  const result = library.symbols.get_screen_size()
  const ptr = new Deno.UnsafePointerView(result)
  const lengthBe = new Uint8Array(Coordinates.size)
  const view = new DataView(lengthBe.buffer)
  ptr.copyInto(lengthBe, 0)
  const decoded = Coordinates.read(view, 0)
  freePointer(result)
  return decoded
}

export function getScaleSize() {
  const result = library.symbols.get_scale_size()
  const ptr = new Deno.UnsafePointerView(result)
  const lengthBe = new Uint8Array(Coordinates.size)
  const view = new DataView(lengthBe.buffer)
  ptr.copyInto(lengthBe, 0)
  const decoded = Coordinates.read(view, 0)
  freePointer(result)
  return decoded
}

// MOUSE

/**
 * Move the mouse to (x, y)
 */
export function move(x: number, y: number) {
  library.symbols.move(x, y)
}

/**
 * Drag the mouse like smooth to (x, y)
 */
export function dragSmooth(x: number, y: number, btn = "left") {
  const ptr = stringToPointer(btn)
  freePointer(ptr)
  library.symbols.drag_smooth(x, y, ptr)
}

/**
 * Moves mouse to (x, y) human like, with the mouse button up.
 */
 export function moveSmooth(x: number, y: number, low = 1.0, high = 3.0) {
  library.symbols.move_smooth(x, y, low, high)
}

/**
 * Gets the mouse coordinates.
 */
export function getMousePos() {
  const result = library.symbols.get_mouse_pos()
  const ptr = new Deno.UnsafePointerView(result)
  const lengthBe = new Uint8Array(Coordinates.size)
  const view = new DataView(lengthBe.buffer)
  ptr.copyInto(lengthBe, 0)
  const decoded = Coordinates.read(view, 0)
  freePointer(result)
  return decoded
}

/**
 * Click the mouse button.
 */
export function click(btn = 'left', double = false) {
  const ptr = stringToPointer(btn)
  freePointer(ptr)
  library.symbols.click(ptr, Number(double))
}

/**
 * Toggles mouse button.
 */
export function toggle(key = "left", btn = 'down') {
  const keyPtr = stringToPointer(key)
  const btnPtr = stringToPointer(btn)
  freePointer(keyPtr)
  freePointer(btnPtr)
  library.symbols.toggle(keyPtr, btnPtr)
}

/**
 * Scrolls the mouse in any direction.
 */
export function scroll(x: number, y: number) {
  library.symbols.scroll(x, y)
}

// KEYBOARD

/**
 * Tap the keyboard code.
 */
export function keyTap(key: string, ...modifiers: string[]) {
  const keyPtr = stringToPointer(key)
  const modifiersPtr = stringToPointer(combineArgs(modifiers))
  freePointer(keyPtr)
  freePointer(modifiersPtr)
  library.symbols.key_tap(keyPtr, modifiersPtr)
}

/**
 * Toggle the keyboard.
 */
export function keyToggle(key: string, ...modifiers: string[]) {
  const keyPtr = stringToPointer(key)
  const modifiersPtr = stringToPointer(combineArgs(modifiers))
  freePointer(keyPtr)
  freePointer(modifiersPtr)
  library.symbols.key_toggle(keyPtr, modifiersPtr)
}

/**
 * Type a string.
 */
export function typeStr(text: string) {
  const textPtr = stringToPointer(text)
  freePointer(textPtr)
  library.symbols.type_str(textPtr)
}

/**
 * Type a string delayed.
 */
export function typeStrDelayed(text: string, delay: number) {
  const textPtr = stringToPointer(text)
  freePointer(textPtr)
  library.symbols.type_str_delay(textPtr, delay)
}
