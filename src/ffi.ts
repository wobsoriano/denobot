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
  save_capture: {
    name: "SaveCapture",
    parameters: ["pointer", "i32", "i32", "i32", "i32"],
    result: "void",
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
  }
});
