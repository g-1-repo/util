---
"@go-corp/utils": major
---

# @go-corp/utils v1.0.0

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
import { toCamelCase, formatDate, deepClone } from '@go-corp/utils'

// String utilities
const camelCased = toCamelCase('hello world') // 'helloWorld'

// Date utilities  
const formatted = formatDate(new Date(), 'medium') // 'Jan 1, 2024'

// Object utilities
const cloned = deepClone({ a: { b: 1 } })
```
