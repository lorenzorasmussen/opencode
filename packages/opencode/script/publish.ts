#!/usr/bin/env bun

import { $ } from "bun"

import pkg from "../package.json"

const dry = process.argv.includes("--dry")
const snapshot = process.argv.includes("--snapshot")

const version = snapshot
  ? `0.0.0-${new Date().toISOString().slice(0, 16).replace(/[-:T]/g, "")}`
  : await $`git describe --tags --exact-match HEAD`
      .text()
      .then((x) => x.substring(1).trim())
      .catch(() => {
        console.error("tag not found")
        process.exit(1)
      })

console.log(`publishing ${version}`)

const GOARCH: Record<string, string> = {
  arm64: "arm64",
  x64: "amd64",
}

const targets = [
  ["linux", "arm64"],
  ["linux", "x64"],
  ["darwin", "x64"],
  ["darwin", "arm64"],
  ["windows", "x64"],
]

await $`rm -rf dist`

const optionalDependencies: Record<string, string> = {}
const npmTag = snapshot ? "snapshot" : "latest"
for (const [os, arch] of targets) {
  console.log(`building ${os}-${arch}`)
  const name = `${pkg.name}-${os}-${arch}`
  await $`mkdir -p dist/${name}/bin`
  await $`GOOS=${os} GOARCH=${GOARCH[arch]} go build -ldflags="-s -w -X main.Version=${version}" -o ../opencode/dist/${name}/bin/tui ../tui/cmd/opencode/main.go`.cwd(
    "../tui",
  )
  await $`bun build --define OPENCODE_VERSION="'${version}'" --compile --minify --target=bun-${os}-${arch} --outfile=dist/${name}/bin/opencode ./src/index.ts ./dist/${name}/bin/tui`
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
  if (!dry)
    await $`cd dist/${name} && npm publish --access public --tag ${npmTag}`
  optionalDependencies[name] = version
}

await $`mkdir -p ./dist/${pkg.name}`
await $`cp -r ./bin ./dist/${pkg.name}/bin`
await $`cp ./script/postinstall.js ./dist/${pkg.name}/postinstall.js`
await Bun.file(`./dist/${pkg.name}/package.json`).write(
  JSON.stringify(
    {
      name: pkg.name + "-ai",
      bin: {
        [pkg.name]: `./bin/${pkg.name}`,
      },
      scripts: {
        postinstall: "node ./postinstall.js",
      },
      version,
      optionalDependencies,
    },
    null,
    2,
  ),
)
if (!dry)
  await $`cd ./dist/${pkg.name} && npm publish --access public --tag ${npmTag}`

if (!snapshot) {
  for (const key of Object.keys(optionalDependencies)) {
    await $`cd dist/${key}/bin && zip -r ../../${key}.zip *`
  }

  const previous = await fetch(
    "https://api.github.com/repos/sst/opencode/releases/latest",
  )
    .then((res) => res.json())
    .then((data) => data.tag_name)

  const commits = await fetch(
    `https://api.github.com/repos/sst/opencode/compare/${previous}...HEAD`,
  )
    .then((res) => res.json())
    .then((data) => data.commits || [])

  const notes = commits
    .map((commit: any) => `- ${commit.commit.message.split("\n")[0]}`)
    .filter((x: string) => {
      const lower = x.toLowerCase()
      return (
        !lower.includes("chore:") &&
        !lower.includes("ci:") &&
        !lower.includes("docs:")
      )
    })
    .join("\n")

  if (!dry)
    await $`gh release create v${version} --title "v${version}" --notes ${notes} ./dist/*.zip`
}
