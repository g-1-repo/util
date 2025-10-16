#!/usr/bin/env bun
import { ProgressIndicator, getCurrentVersion } from '@go-corp/utils'
import { readFileSync } from 'fs'

/**
 * Demo script for showcasing @go-corp/utils library capabilities
 * Demonstrates utility functions, MCP server integration, and library features
 */
async function main() {
  try {
    const spinner = new ProgressIndicator('Loading @go-corp/utils demo...')
    spinner.start()
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    spinner.stop('Demo loaded!')
    
    const pkg = JSON.parse(readFileSync('package.json', 'utf8'))
    const version = getCurrentVersion()
    
    console.log('\n🚀 @go-corp/utils Library Demo')
    console.log('=====================================')
    console.log(`Version: ${version}`)
    console.log(`Description: ${pkg.description}\n`)
    
    console.log('🎆 Key Features:')
    const features = [
      'Comprehensive TypeScript utility functions',
      'String manipulation (camelCase, kebab-case, slugify)',
      'Date utilities with relative time formatting',
      'Object and array manipulation helpers',
      'Validation utilities (email, URL, phone, UUID)',
      'Async utilities (debounce, throttle, retry)',
      'Node.js utilities (git operations, CLI prompts)',
      'Web utilities (clipboard, query params)',
      'Type guards and TypeScript utilities',
      'MCP server integration for AI assistants'
    ]
    features.forEach(feature => console.log(`  • ${feature}`))
    
    console.log('\n🔧 Utility Categories:')
    const categories = {
      'String': 'toCamelCase, toKebabCase, slugify, truncate',
      'Date': 'formatDate, daysBetween, addDays, getRelativeTime', 
      'Object': 'deepClone, pick, omit, isEmpty',
      'Array': 'unique, groupBy, chunk, shuffle',
      'Validation': 'isValidEmail, isValidUrl, isValidPhone',
      'Async': 'delay, debounce, throttle, retry',
      'Node.js': 'git operations, CLI prompts, file operations',
      'Web': 'copyToClipboard, getQueryParams, formatBytes',
      'Math': 'clamp, randomBetween, roundTo, percentage',
      'Types': 'isString, isNumber, isArray, isObject'
    }
    Object.entries(categories).forEach(([category, utilities]) => {
      console.log(`  ${category}: ${utilities}`)
    })
    
    console.log('\n🤖 MCP Server Integration:')
    console.log('  • Automatic project context detection')
    console.log('  • AI assistant utility suggestions') 
    console.log('  • Integration with Warp terminal')
    console.log('  • Context-aware development assistance')
    
    console.log('\n🛠️ Development Commands:')
    const commands = [
      'bun install        - Install dependencies',
      'bun run build      - Build library (CJS + ESM)',
      'bun run dev        - Development mode with watch',
      'bun run test       - Run all tests with Vitest',
      'bun run lint       - Lint with ESLint',
      'bun run type-check - TypeScript type checking',
      'bun run workflow   - Interactive development workflow',
      'bun run release    - Automated release process'
    ]
    commands.forEach(cmd => console.log(`  ${cmd}`))
    
    console.log('\n📦 Package Management:')
    const packageCommands = [
      'bun run changeset      - Create changeset',
      'bun run publish:public - Publish to NPM',
      'bun run release        - Full automated release'
    ]
    packageCommands.forEach(cmd => console.log(`  ${cmd}`))
    
    console.log('\n🎨 Usage Examples:')
    console.log('```typescript')
    console.log("import { toCamelCase, formatDate, deepClone } from '@go-corp/utils'")
    console.log('')
    console.log("// String utilities")
    console.log("const camel = toCamelCase('hello world') // 'helloWorld'")
    console.log('')
    console.log("// Date utilities")
    console.log("const formatted = formatDate(new Date(), 'medium')")
    console.log('')
    console.log("// Object utilities") 
    console.log("const cloned = deepClone({ nested: { data: 'value' } })")
    console.log('```')
    
    console.log('\n🚀 Try it out:')
    console.log('  1. Install: npm install @go-corp/utils')
    console.log('  2. Import utilities in your TypeScript/JavaScript project')
    console.log('  3. Configure MCP server for AI integration in Warp')
    console.log('  4. Run "bun run workflow" for interactive development utilities')
    console.log('  5. Use "bun run release" for automated releases')
    
    console.log('\n✨ Perfect for:')
    console.log('  • TypeScript/JavaScript projects needing common utilities')
    console.log('  • CLI tool development with interactive prompts')
    console.log('  • Release automation and version management')
    console.log('  • AI-assisted development workflows')
    
    console.log('\n💡 Happy coding with @go-corp/utils!')
    
  } catch (error) {
    console.error('\n❌ Demo error:', error)
    process.exit(1)
  }
}

main()