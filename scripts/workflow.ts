#!/usr/bin/env bun
import { 
  select, 
  getCurrentBranch,
  getCurrentVersion,
  getChangedFiles,
  hasUncommittedChanges
} from '@go-corp/utils'

/**
 * Development workflow script for @go-corp/utils
 * Provides utilities for branch management, releases, and development tasks
 */
async function main() {
  try {
    console.log('🚀 @go-corp/utils - Development Workflow')
    console.log('=========================================\n')
    
    const action = await select({
      message: 'What would you like to do?',
      options: [
        { value: 'branch-info', label: 'Show current branch info' },
        { value: 'git-status', label: 'Show git status' },
        { value: 'show-version', label: 'Show current version' },
        { value: 'build', label: 'Build library' },
        { value: 'test', label: 'Run tests' },
        { value: 'exit', label: 'Exit' }
      ]
    })
    
    switch (action) {
      case 'branch-info':
        const branch = getCurrentBranch()
        const hasChanges = hasUncommittedChanges()
        const changedFiles = getChangedFiles()
        console.log('\n📋 Current branch info:')
        console.log(`Branch: ${branch}`)
        console.log(`Has uncommitted changes: ${hasChanges}`)
        if (hasChanges && changedFiles.length > 0) {
          console.log(`Changed files: ${changedFiles.slice(0, 5).join(', ')}${changedFiles.length > 5 ? '...' : ''}`)
        }
        break
        
      case 'git-status':
        const currentBranch = getCurrentBranch()
        const uncommitted = hasUncommittedChanges()
        const files = getChangedFiles()
        console.log('\n📊 Git status:')
        console.log(`Current branch: ${currentBranch}`)
        console.log(`Uncommitted changes: ${uncommitted}`)
        if (files.length > 0) {
          console.log(`Changed files (${files.length}):`)
          files.forEach(file => console.log(`  ${file}`))
        }
        break
        
      case 'show-version':
        const version = getCurrentVersion()
        console.log(`\n📦 Current version: ${version}`)
        break
        
      case 'build':
        console.log('\n🔨 Building @go-corp/utils library...')
        const { execSync } = await import('child_process')
        execSync('bun run build', { stdio: 'inherit' })
        console.log('✅ Build completed!')
        break
        
      case 'test':
        console.log('\n🧪 Running tests...')
        const { execSync: exec } = await import('child_process')
        exec('bun run test', { stdio: 'inherit' })
        break
        
      case 'exit':
        console.log('\n👋 Goodbye!')
        break
        
      default:
        console.log('\n❓ Unknown action')
    }
  } catch (error) {
    console.error('\n❌ Workflow error:', error)
    process.exit(1)
  }
}

main()