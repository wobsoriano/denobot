const OS = Deno.build.os

function extension() {
  if (OS === 'darwin') {
    return ".dylib"
  }

  if (OS === 'windows') {
    return ".dll"
  }

  return ".so"
}

function flags() {
  if (OS === 'windows') {
    return ["-ldflags", "-s"]
  }

  return ["-ldflags", "-s -w"]
}

const folder = ".cache"
const name = "robotgo"

const cmd = Deno.run({
  cmd: ["go", "build", "-a", ...flags(), "-o", `${folder}/${name}${extension()}`, "-buildmode=c-shared", "robotgo.go"],
  stdout: "piped"
})

const stdout = await cmd.output();

const decoded = new TextDecoder().decode(stdout);

console.log(decoded)
