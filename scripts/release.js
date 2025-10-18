#!/usr/bin/env node

import {
  confirm,
  select,
} from '@go-corp/utils/node'
import {
  GitOperations,
  createGitOperations,
} from '@go-corp/utils/node'
import { readFileSync, writeFileSync } from 'fs'
import { execSync } from 'child_process'

// Simple color constants
const COLORS = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  reset: '\x1b[0m'
}

// Simple log function with colors
function log(message, color = '') {
  console.log(`${color}${message}${COLORS.reset}`)
}

// Using incrementVersion from @go-corp/utils library

// Function to read package.json
async function readPackageJson() {
  const packagePath = 'package.json'
  const content = readFileSync(packagePath, 'utf8')
  return JSON.parse(content)
}

// Function to write package.json
async function writePackageJson(packageData) {
  const packagePath = 'package.json'
  const content = JSON.stringify(packageData, null, 2) + '\n'
  writeFileSync(packagePath, content)
}

// Function to commit and push changes
async function commitAndPush(git, message, createTag = false) {
  if (createTag) {
    const version = git.getCurrentVersion()
    // Create git tag using git command
    try {
      await git.createTag(`v${version}`, `Release v${version}`)
    } catch (error) {
      console.warn(`Warning: Could not create tag v${version}:`, error.message)
    }
  }
  
  try {
    git.commitAndPush(message, true)
  } catch (error) {
    if (error.message.includes('has no upstream branch')) {
      log('Attempting to set upstream branch and push...', COLORS.yellow)
      const branchName = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim()
      execSync(`git push --set-upstream origin ${branchName}`, { stdio: 'inherit' })
      log('✔ Successfully pushed with upstream branch set.', COLORS.green)
    } else {
      throw error // Re-throw other errors
    }
  }
  
  // Push tags if they were created
  if (createTag) {
    try {
      await git.pushTags()
    } catch (error) {
      console.warn('Warning: Could not push tags:', error.message)
    }
  }
}

/**
 * Interactive release script using @go-corp/utils
 * Supports automatic version detection or manual override
 */
async function createRelease() {
  const git = createGitOperations()
  
  try {
    log('🚀 Starting automated release process for @go-corp/utils...', COLORS.cyan)

    // Get current version
    const currentVersion = git.getCurrentVersion()
    log(`📋 Current version: ${currentVersion}`, COLORS.blue)

    // Analyze changes
    log('🔍 Analyzing changes...', COLORS.yellow)
    const analysis = git.analyzeChangesForVersionBump()
    
    // Analysis complete

    log(`📁 Found ${analysis.changedFiles.length} changed files`, COLORS.green)
    log(`📝 Found ${analysis.commits.length} recent commits`, COLORS.green)
    log(`🎯 Recommended version bump: ${analysis.versionBump}`, COLORS.yellow)

    // Show analysis details
    if (analysis.changesList.length > 0) {
      console.log('\n📋 Detected changes:')
      analysis.changesList.forEach((change, index) => {
        console.log(`  ${index + 1}. ${change}`)
      })
    }

    if (analysis.changedFiles.length > 0) {
      console.log('\n📁 Changed files:')
      analysis.changedFiles.slice(0, 10).forEach((file, index) => {
        console.log(`  ${index + 1}. ${file}`)
      })
      if (analysis.changedFiles.length > 10) {
        console.log(`  ... and ${analysis.changedFiles.length - 10} more files`)
      }
    }

    // Prepare version options with safe calculations
    const patchVersion = git.incrementVersion(currentVersion, 'patch')
    const minorVersion = git.incrementVersion(currentVersion, 'minor') 
    const majorVersion = git.incrementVersion(currentVersion, 'major')
    const recommendedVersion = git.incrementVersion(currentVersion, analysis.versionBump)
    
    // Version options calculated
    
    // Determine version bump type
    const versionBumpType = await select({
      message: 'Select version bump type:',
      options: [
        { value: analysis.versionBump, label: `${analysis.versionBump} (recommended) → ${recommendedVersion}` },
        { value: 'patch', label: `patch → ${patchVersion}` },
        { value: 'minor', label: `minor → ${minorVersion}` },
        { value: 'major', label: `major → ${majorVersion}` }
      ]
    })
    
    // The selected bump type is already the value from the selection
    const selectedBumpType = versionBumpType
    
    // Version selected

    const newVersion = git.incrementVersion(currentVersion, selectedBumpType)
    log(`🎯 Selected version: ${newVersion} (${selectedBumpType})`, COLORS.cyan)

    // Get changelog entries
    let changesList = analysis.changesList

    // Allow manual changelog override
    const useAutoChangelog = await confirm({
      message: 'Use automatically detected changes for changelog?',
      default: true
    })

    if (!useAutoChangelog) {
      log('📝 Please edit the changelog manually after the release', COLORS.yellow)
      changesList = ['Manual release - see commit history for details']
    }

    // Ask about publishing
    const shouldPublish = await confirm({
      message: 'Publish to npm after release?',
      default: false
    })

    // Final confirmation
    const shouldProceed = await confirm({
      message: `Create release ${newVersion}? This will update package.json, changelog, commit, push${shouldPublish ? ', and publish to npm' : ''}.`,
      default: false
    })

    if (!shouldProceed) {
      log('❌ Release cancelled', COLORS.red)
      process.exit(0)
    }

    // Execute release steps
    log(`📦 Updating package.json to version ${newVersion}...`, COLORS.cyan)
    git.updatePackageVersion(newVersion)

    log('📝 Updating CHANGELOG.md...', COLORS.cyan)
    git.updateChangelog(newVersion, analysis.changeType, changesList)

    log('📤 Committing and pushing changes...', COLORS.cyan)
    const commitMessage = `chore: release v${newVersion}`
    await commitAndPush(git, commitMessage, true)

    // Publish to npm if requested
    if (shouldPublish) {
      log('📦 Publishing to npm...', COLORS.cyan)
      try {
        execSync('bun run build', { stdio: 'inherit' })
        execSync('npm publish --access public', { stdio: 'inherit' })
        log('✅ Successfully published to npm!', COLORS.green)
      } catch (error) {
        log('❌ Failed to publish to npm:', COLORS.red)
        log(error.message, COLORS.red)
        log('You can manually publish later with: bun run publish:public', COLORS.yellow)
      }
    }

    log(`✅ Release v${newVersion} completed successfully!`, COLORS.green)
    log(`🎉 Your TypeScript utilities release has been published to Git${shouldPublish ? ' and npm' : ''}!`, COLORS.magenta)

    // Show next steps
    console.log('\n📋 Next steps:')
    if (!shouldPublish) {
      console.log('• Run `bun run publish:public` to publish to npm')
    }
    console.log('• Create a GitHub release if desired')
    console.log('• Update dependent projects to use the new version')
    console.log('• Test the MCP server integration with the new utilities')
    if (shouldPublish) {
      console.log('• Verify the package is available on npmjs.com')
      console.log(`• Test installation: \`npm install @go-corp/utils@${newVersion}\``)
    }
  }
  catch (error) {
    log(`❌ Release failed: ${error.message}`, COLORS.red)
    console.error(error)
    process.exit(1)
  }
}

// Handle command line arguments
const args = process.argv.slice(2)
const helpFlag = args.includes('--help') || args.includes('-h')

if (helpFlag) {
  console.log(`
🚀 @go-corp/utils Automated Release Script

Usage:
  node scripts/release.js          # Interactive release with automatic detection
  node scripts/release.js --help   # Show this help message

This script will:
1. Analyze your Git history and changed files
2. Recommend an appropriate version bump (patch/minor/major)
3. Allow you to override the recommendation
4. Update package.json version
5. Generate/update CHANGELOG.md
6. Commit and push changes
7. Create Git tags
8. Optionally publish to npm

The script uses @go-corp/utils for all Git operations and follows semantic versioning.
Perfect for TypeScript utility library releases with automated changelog management and npm publishing.
`)
  process.exit(0)
}

// Run the release
createRelease()