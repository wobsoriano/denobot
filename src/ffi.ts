import { plug } from "../deps.ts";

const options: plug.Options = {
  name: "robotgo",
  cache: ".cache",
  urls: {
    darwin: `.bin/robotgo.dylib`,
    windows: `.bin/robotgo.dll`,
    linux: `.bin/robotgo.so`,
  },
};

export const library = await plug.prepare(options, {
  free_string: {
    name: "FreeString",
    parameters: ["pointer"],
    result: "void",
  },
  get_version: {
    name: "GetVersion",
    parameters: [],
    result: "pointer",
  },
  // screen
  get_mouse_color: {
    name: "GetMouseColor",
    parameters: [],
    result: "pointer",
  },
  get_pixel_color: {
    name: "GetPixelColor",
    parameters: ["i32", "i32"],
    result: "pointer",
  },
  get_screen_size: {
    name: "GetScreenSize",
    parameters: [],
    result: "pointer",
  },
  get_scale_size: {
    name: "GetScaleSize",
    parameters: [],
    result: "pointer",
  },
  // mouse
  move: {
    name: "Move",
    parameters: ["i32", "i32"],
    result: "void",
  },
  drag_smooth: {
    name: "DragSmooth",
    parameters: ["i32", "i32", "pointer"],
    result: "void",
  },
  move_smooth: {
    name: "MoveSmooth",
    parameters: ["i32", "i32", "f64", "f64"],
    result: "void",
  },
  get_mouse_pos: {
    name: "GetMousePos",
    parameters: [],
    result: "pointer"
  },
  click: {
    name: "GetMousePos",
    parameters: ["pointer", "u8"],
    result: "void"
  },
  toggle: {
    name: "Toggle",
    parameters: ["pointer", "pointer"],
    result: "void",
  },
  scroll: {
    name: "Scroll",
    parameters: ["i32", "i32"],
    result: "void",
  },
  // keyboard
  key_tap: {
    name: "KeyTap",
    parameters: ["pointer", "pointer"],
    result: "pointer"
  },
  key_toggle: {
    name: "KeyToggle",
    parameters: ["pointer", "pointer"],
    result: "pointer"
  },
  type_str: {
    name: "TypeStr",
    parameters: ["pointer"],
    result: "void"
  },
  type_str_delay: {
    name: "TypeStrDelay",
    parameters: ["pointer", "i64"],
    result: "void"
  },
  read_all: {
    name: "ReadAll",
    parameters: [],
    result: "pointer"
  },
  write_all: {
    name: "WriteAll",
    parameters: ["pointer"],
    result: "pointer"
  },
  paste_str: {
    name: "PasteStr",
    parameters: ["pointer"],
    result: "void"
  }
});
