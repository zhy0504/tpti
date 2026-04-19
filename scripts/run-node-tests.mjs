import { readdirSync } from 'node:fs'
import path from 'node:path'
import { spawnSync } from 'node:child_process'

function collectTestFiles(directory) {
  const entries = readdirSync(directory, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name)

    if (entry.isDirectory()) {
      files.push(...collectTestFiles(fullPath))
      continue
    }

    if (entry.isFile() && entry.name.endsWith('.test.js')) {
      files.push(fullPath)
    }
  }

  return files.sort()
}

const targetDirectory = process.argv[2]

if (!targetDirectory) {
  console.error('Usage: node scripts/run-node-tests.mjs <tests-directory>')
  process.exit(1)
}

const resolvedDirectory = path.resolve(process.cwd(), targetDirectory)
const testFiles = collectTestFiles(resolvedDirectory)

if (!testFiles.length) {
  console.error(`No test files found in ${targetDirectory}`)
  process.exit(1)
}

const result = spawnSync(process.execPath, ['--test', ...testFiles], {
  stdio: 'inherit'
})

process.exit(result.status ?? 1)
