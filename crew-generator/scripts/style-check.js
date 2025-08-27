#!/usr/bin/env node

/**
 * Style Check Script
 * Prevents inline styles and !important declarations in chat components
 * Run: npm run style-check
 */

import { readFileSync, readdirSync, statSync } from 'fs'
import { join, extname } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Configuration
const ROOT_DIR = join(__dirname, '..')
const CHECK_PATTERNS = [
  // Inline width/height in chat components
  {
    pattern: /style=\{[^}]*(?:width|height|maxWidth|maxHeight):\s*['"`]\d+px['"`]/g,
    message: 'Hardcoded pixel dimensions found in style prop. Use design tokens instead.',
    severity: 'error'
  },
  // !important declarations
  {
    pattern: /!\s*important/g,
    message: '!important declaration found. Use component variants or higher specificity instead.',
    severity: 'error'
  },
  // Hardcoded z-index values
  {
    pattern: /(?:zIndex|z-index):\s*['"`]?\d+['"`]?/g,
    message: 'Hardcoded z-index found. Use z-index design tokens (--z-*) instead.',
    severity: 'error'
  },
  // Inline max-width on message components
  {
    pattern: /className=[^>]*max-w-\[\d+px\]/g,
    message: 'Hardcoded max-width class found. Use responsive .message-bubble class instead.',
    severity: 'error'
  }
]

const DIRECTORIES_TO_CHECK = [
  'src/components/ui',
  'src/pages',
  'src/examples'
]

const FILE_EXTENSIONS = ['.tsx', '.ts', '.jsx', '.js']

let errorCount = 0
let warningCount = 0

function checkFile(filePath) {
  const content = readFileSync(filePath, 'utf-8')
  const relativePath = filePath.replace(ROOT_DIR + '/', '')
  const lines = content.split('\n')
  
  let fileHasIssues = false

  CHECK_PATTERNS.forEach(({ pattern, message, severity }) => {
    const matches = content.matchAll(pattern)
    
    for (const match of matches) {
      // Find line number
      const beforeMatch = content.substring(0, match.index)
      const lineNumber = beforeMatch.split('\n').length
      const lineContent = lines[lineNumber - 1]?.trim()
      
      console.log(`\n${severity.toUpperCase()}: ${relativePath}:${lineNumber}`)
      console.log(`  ${message}`)
      console.log(`  Found: ${match[0]}`)
      console.log(`  Line: ${lineContent}`)
      
      if (severity === 'error') {
        errorCount++
      } else {
        warningCount++
      }
      fileHasIssues = true
    }
  })
  
  return fileHasIssues
}

function scanDirectory(dirPath) {
  const items = readdirSync(dirPath)
  
  for (const item of items) {
    const fullPath = join(dirPath, item)
    const stat = statSync(fullPath)
    
    if (stat.isDirectory()) {
      // Skip node_modules and build directories
      if (item !== 'node_modules' && item !== 'dist' && item !== 'build') {
        scanDirectory(fullPath)
      }
    } else if (stat.isFile()) {
      const ext = extname(fullPath)
      if (FILE_EXTENSIONS.includes(ext)) {
        checkFile(fullPath)
      }
    }
  }
}

function main() {
  console.log('🎨 Chat UI Style Check')
  console.log('========================')
  console.log('Checking for hardcoded styles and !important declarations...\n')

  for (const dir of DIRECTORIES_TO_CHECK) {
    const fullDirPath = join(ROOT_DIR, dir)
    try {
      console.log(`Checking ${dir}/...`)
      scanDirectory(fullDirPath)
    } catch (error) {
      console.warn(`Warning: Could not scan ${dir} - ${error.message}`)
    }
  }

  console.log('\n========================')
  console.log('📊 Style Check Results')
  console.log('========================')
  
  if (errorCount === 0 && warningCount === 0) {
    console.log('✅ No style issues found! Great job following design system conventions.')
  } else {
    console.log(`❌ Found ${errorCount} error(s) and ${warningCount} warning(s)`)
    console.log('\n💡 Quick fixes:')
    console.log('  • Replace hardcoded px values with design tokens (var(--space-*), var(--avatar-*))')
    console.log('  • Use .message-bubble class for responsive max-width')
    console.log('  • Replace z-index numbers with design tokens (var(--z-*))')
    console.log('  • Remove !important - use component variants instead')
  }

  // Exit with error code if issues found
  if (errorCount > 0) {
    process.exit(1)
  }
}

main()
