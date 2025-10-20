#!/usr/bin/env bun
import path from "path"
const dir = new URL("..", import.meta.url).pathname
process.chdir(dir)
import { $ } from "bun"

import pkg from "../package.json"

const GOARCH: Record<string, string> = {
  arm64: "arm64",
  x64: "amd64",
  "x64-baseline": "amd64",
}

const targets = [
  ["windows", "x64"],
  ["linux", "arm64"],
  ["linux", "x64"],
  ["linux", "x64-baseline"],
  ["darwin", "x64"],
  ["darwin", "x64-baseline"],
  ["darwin", "arm64"],
]

await $`rm -rf dist`

const binaries: Record<string, string> = {}
const version = process.env["OPENCODE_VERSION"] ?? "dev"
for (const [os, arch] of targets) {
  console.log(`building ${os}-${arch}`)
  const name = `${pkg.name}-${os}-${arch}`
  await $`mkdir -p dist/${name}/bin`
  await $`CGO_ENABLED=0 GOOS=${os} GOARCH=${GOARCH[arch]} go build -ldflags='-s' -o ../opencode/dist/${name}/bin/tui ../tui/cmd/opencode/main.go`.cwd(
    "../tui",
  )

  const watcher = `@parcel/watcher-${os === "windows" ? "win32" : os}-${arch.replace("-baseline", "")}${os === "linux" ? "-glibc" : ""}`
  await $`mkdir -p ../../node_modules/${watcher}`
  await $`npm pack npm pack ${watcher}`.cwd(path.join(dir, "../../node_modules")).quiet()
  await $`tar -xf ../../node_modules/${watcher.replace("@parcel/", "parcel-")}-*.tgz -C ../../node_modules/${watcher} --strip-components=1`

  await Bun.build({
    compile: {
      target: `bun-${os}-${arch}` as any,
      outfile: `dist/${name}/bin/opencode`,
      execArgv: [`--user-agent=opencode/${version}`, `--env-file=""`, `--`],
      windows: {},
    },
    entrypoints: ["./src/index.ts"],
    define: {
      OPENCODE_VERSION: `'${version}'`,
      OPENCODE_TUI_PATH: `'${path.resolve(dir, `dist/${name}/bin/tui`)}'`,
    },
  })
  await $`rm -rf ./dist/${name}/bin/tui`
  await Bun.file(`dist/${name}/package.json`).write(
    JSON.stringify(
      {
        name,
        version,
        os: [os === "windows" ? "win32" : os],
        cpu: [arch],
      },
      null,
      2,
    ),
  )
  binaries[name] = version
}

export { binaries }
