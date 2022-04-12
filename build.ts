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

console.log("build c-shared started...")

const cmd = Deno.run({
  cmd: ["go", "build", "-a", ...flags(), "-o", `${folder}/${name}${extension()}`, "-buildmode=c-shared", "robotgo.go"],
  "stderr": "piped"
})

const status = await cmd.status()

if (status.success) {
  console.log("build succeeded")
} else {
  const stderr = await cmd.stderrOutput()
  const decoded = new TextDecoder().decode(stderr);
  console.log(decoded)
}


