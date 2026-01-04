const fs = require('fs')
const path = require('path')

function walk(dir) {
  let results = []
  const list = fs.readdirSync(dir)
  list.forEach(file => {
    const p = path.join(dir, file)
    const stat = fs.statSync(p)
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(p))
    } else {
      results.push(p)
    }
  })
  return results
}

const root = path.resolve(__dirname, '..', 'src', 'components', 'blocks', 'editors')
if (!fs.existsSync(root)) {
  console.error('Editors folder not found:', root)
  process.exit(1)
}

const files = walk(root).filter(f => f.endsWith('.tsx') || f.endsWith('.ts') )
const withOnUpdate = []
const withUpdateContent = []
const withoutEither = []

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8')
  const hasOnUpdate = /\bonUpdate\b/.test(content)
  const hasUpdateContent = /\bupdateContent\b/.test(content)
  if (hasOnUpdate) withOnUpdate.push(f)
  if (hasUpdateContent) withUpdateContent.push(f)
  if (!hasOnUpdate && !hasUpdateContent) withoutEither.push(f)
})

const out = {
  total: files.length,
  withOnUpdate: withOnUpdate.length,
  withUpdateContent: withUpdateContent.length,
  withoutEither: withoutEither.length,
  filesWithOnUpdate: withOnUpdate,
  filesWithUpdateContent: withUpdateContent,
  filesWithoutEither: withoutEither
}

// Write report and also print JSON to stdout for CI
const reportPath = path.resolve(process.cwd(), 'tmp', 'onupdate-report.json')
fs.mkdirSync(path.dirname(reportPath), { recursive: true })
fs.writeFileSync(reportPath, JSON.stringify(out, null, 2))
console.log(JSON.stringify(out, null, 2))
console.log('Wrote report to', reportPath)
