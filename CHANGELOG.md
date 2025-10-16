# @go-corp/utils

## 1.2.0

### Minor Changes

- Update source code and functionality
- Update dependencies and package configuration
- Update TypeScript configuration
- Update documentation
- Improve testing coverage
- Update configuration files
- Fix bugs and resolve issues
- General maintenance and updates
- Add new features and functionality


## 1.1.2

### Patch Changes

- fixed analyzeChangesForVersionBump()

## 1.1.1

### Patch Changes

- Transfer package to @go-corp organization
  - Move from personal scope to Go Corp organization
  - Update repository URLs and metadata
  - No functional changes to utilities

## 1.1.0

### Minor Changes

- # Add Node.js utilities and MCP server integration

  Major expansion of the utility library with server-side tools and AI integration:

  ## New Features

  ### 🔧 Node.js Git & Repository Management
  - `analyzeChangesForVersionBump()` - Intelligent version bump analysis
  - `updateChangelog()` - Automated changelog generation
  - `getCurrentBranch()`, `hasUncommittedChanges()` - Git status utilities
  - `incrementVersion()`, `commitAndPush()` - Release automation
  - `exec()` with colored logging - Safe shell command execution

  ### 🎯 Interactive CLI Prompts
  - `confirm()`, `select()`, `multiselect()` - User input prompts
  - `password()` - Secure password input with masking
  - `text()` - Text input with validation
  - `ProgressIndicator` - Animated progress spinners

  ### 🤖 MCP Server Integration
  - **AI Context Awareness** - Automatically tells AI assistants about available utilities
  - **Smart Suggestions** - AI knows when to suggest utilities for specific tasks
  - **Project Detection** - Detects @golive_me/utils installation automatically
  - **Warp Terminal Integration** - Works seamlessly with MCP protocol

  ### 📚 Enhanced Documentation
  - Comprehensive API documentation with examples
  - MCP server setup instructions
  - Example release script demonstrating utilities
  - Complete TypeScript definitions

  ## Perfect For
  - **Release Automation** - Automated version bumping and changelog generation
  - **CLI Development** - Interactive terminal applications with beautiful UX
  - **Git Workflows** - Repository management and automation
  - **Developer Tooling** - Build scripts and development utilities

  Based on battle-tested automation scripts from livemercial-website project.

## 1.0.0

### Major Changes

- 8e426d9: # @go-corp/utils v1.0.0

  Initial release of @go-corp/utils - a comprehensive collection of utility functions for TypeScript/JavaScript projects.

  ## Features

  ✨ **Comprehensive Utilities**: String, date, object, array, validation, async, type, math, web, and debug utilities

  🚀 **TypeScript First**: Written in TypeScript with full type support and IntelliSense

  📦 **Dual Package**: ESM and CommonJS support for maximum compatibility

  🧪 **Well Tested**: Complete test suite with Vitest

  📚 **Fully Documented**: Comprehensive API documentation and usage examples

  ## Installation

  ```bash
  npm install @go-corp/utils
  # or
  yarn add @go-corp/utils
  # or
  bun add @go-corp/utils
  ```

  ## Quick Start

  ```typescript
  import { toCamelCase, formatDate, deepClone } from "@go-corp/utils";

  // String utilities
  const camelCased = toCamelCase("hello world"); // 'helloWorld'

  // Date utilities
  const formatted = formatDate(new Date(), "medium"); // 'Jan 1, 2024'

  // Object utilities
  const cloned = deepClone({ a: { b: 1 } });
  ```
