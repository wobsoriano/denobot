import { Plug } from "https://deno.land/x/plug@0.5.1/mod.ts";

const options: Plug.Options = {
  name: "robotgo",
  cache: 'bin',
  urls: {
    darwin: `./robotgo.dylib`,
    windows: `./robotgo.dll`,
    linux: `./robotgo.so`,
  },
};

const library = await Plug.prepare(options, {
  Scroll: { 
    parameters: ["i8", "i8"], 
    result: "void" 
  },
  getMousePos: {
    name: 'GetMousePos',
    parameters: [],
    result: []
  }
});

library.symbols.Scroll(10, 10);
