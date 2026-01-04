const fs = require('fs')
const path = require('path')

function walk(dir) {
  return fs.readdirSync(dir).flatMap(name => {
    const full = path.join(dir, name)
    const st = fs.statSync(full)
    return st.isDirectory() ? walk(full) : [full]
  })
}

const root = path.resolve(__dirname, '..', 'src', 'components', 'blocks', 'editors')
if (!fs.existsSync(root)) {
  console.error('Editors dir not found:', root)
  process.exit(1)
}

const files = walk(root).filter(f => f.endsWith('.tsx') || f.endsWith('.ts'))
const backupDir = path.resolve(process.cwd(), 'tmp', 'instrument-backups')
fs.mkdirSync(backupDir, { recursive: true })

files.forEach(file => {
  let src = fs.readFileSync(file, 'utf8')
  const hasOnUpdate = /\bonUpdate\b/.test(src)
  const hasUpdateContent = /\bupdateContent\b/.test(src)
  if (!hasOnUpdate && !hasUpdateContent) return

  // backup
  const rel = path.relative(process.cwd(), file)
  const bakPath = path.join(backupDir, rel.replace(/[\/]/g, '__'))
  fs.mkdirSync(path.dirname(bakPath), { recursive: true })
  fs.writeFileSync(bakPath + '.bak', src)

  // inject helper once near top (after first import block)
  if (!/__DEV_WRAP_ON_UPDATE__/.test(src)) {
    const inject = `\n// __DEV_WRAP_ON_UPDATE__ - injected by scripts/instrument-updates.js for debugging\nconst __devWrap = (fn, name) => {
  if (process.env.NODE_ENV === 'production') return fn
  if (typeof fn !== 'function') return fn
  return function(...args) {
    try { console.debug('[dev] ' + name, args[0]) } catch (e) {}
    return fn(...args)
  }
}\n`

    // place after last import
    const importEnd = src.search(/\n[^\n]*export default function|\n[^\n]*export default const|\n[^\n]*export function/)
    if (importEnd > -1) {
      src = src.slice(0, importEnd) + inject + src.slice(importEnd)
    } else {
      src = inject + src
    }
  }

  // wrap param names by adding assignments after opening brace of default export function
  const pattern = /export default function\s+([A-Za-z0-9_]+)\s*\(([^)]*)\)\s*{/
  const m = src.match(pattern)
  if (m) {
    const comp = m[1]
    const params = m[2]
    const insertAfter = m.index + m[0].length
    let wrapper = '\n  // dev wrappers for update functions (injected)\n'
    if (/\bonUpdate\b/.test(params)) {
      wrapper += `  if (typeof onUpdate === 'function') onUpdate = __devWrap(onUpdate, '${comp}@${path.basename(file)}')\n`
    }
    if (/\bupdateContent\b/.test(params)) {
      wrapper += `  if (typeof updateContent === 'function') updateContent = __devWrap(updateContent, '${comp}@${path.basename(file)}')\n`
    }
    if (wrapper.trim() !== '') {
      src = src.slice(0, insertAfter) + wrapper + src.slice(insertAfter)
    }
  } else {
    // fallback: look for first function component pattern with props destructuring
    const pattern2 = /export default function\s*\([^)]*\)\s*{/
    const m2 = src.match(pattern2)
    if (m2) {
      const insertAfter = m2.index + m2[0].length
      let wrapper = '\n  // dev wrappers for update functions (injected, fallback)\n'
      if (hasOnUpdate) wrapper += `  try { if (typeof onUpdate === 'function') onUpdate = __devWrap(onUpdate, '${path.basename(file)}') } catch(e){}\n`
      if (hasUpdateContent) wrapper += `  try { if (typeof updateContent === 'function') updateContent = __devWrap(updateContent, '${path.basename(file)}') } catch(e){}\n`
      src = src.slice(0, insertAfter) + wrapper + src.slice(insertAfter)
    }
  }

  fs.writeFileSync(file, src)
  console.log('Instrumented', file)
})

console.log('Instrumentation complete')
