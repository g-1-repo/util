/**
 * Environment utilities for consistent environment variable handling
 * Works in both Node.js and edge environments
 */

/**
 * Environment detection utilities
 */
export function isDev(): boolean {
  return getEnv('NODE_ENV') === 'development'
}

export function isProd(): boolean {
  return getEnv('NODE_ENV') === 'production'
}

export function isTest(): boolean {
  return getEnv('NODE_ENV') === 'test'
}

/**
 * Get environment variable with fallback
 * Works in both Node.js and edge environments like Cloudflare Workers
 */
export function getEnv(key: string, defaultValue?: string): string | undefined {
  // Try process.env first (Node.js)
  if (typeof process !== 'undefined' && process.env) {
    const value = process.env[key]
    if (value !== undefined)
      return value
  }

  // Fallback to globalThis for edge environments
  if (typeof globalThis !== 'undefined' && (globalThis as any).process?.env) {
    const value = (globalThis as any).process.env[key]
    if (value !== undefined)
      return value
  }

  return defaultValue
}

/**
 * Require an environment variable - throws if not found
 */
export function requireEnv(key: string): string {
  const value = getEnv(key)
  if (!value) {
    throw new Error(`Environment variable ${key} is required but not set`)
  }
  return value
}

/**
 * Get environment variable as number
 */
export function getEnvNumber(key: string, defaultValue?: number): number | undefined {
  const value = getEnv(key)
  if (!value)
    return defaultValue

  const num = Number(value)
  if (Number.isNaN(num)) {
    throw new TypeError(`Environment variable ${key} must be a number, got: ${value}`)
  }
  return num
}

/**
 * Get environment variable as boolean
 */
export function getEnvBoolean(key: string, defaultValue?: boolean): boolean | undefined {
  const value = getEnv(key)
  if (!value)
    return defaultValue

  const lower = value.toLowerCase()
  if (['true', '1', 'yes', 'on'].includes(lower))
    return true
  if (['false', '0', 'no', 'off'].includes(lower))
    return false

  throw new Error(`Environment variable ${key} must be a boolean, got: ${value}`)
}

/**
 * Get environment variable as JSON
 */
export function getEnvJson<T = any>(key: string, defaultValue?: T): T | undefined {
  const value = getEnv(key)
  if (!value)
    return defaultValue

  try {
    return JSON.parse(value) as T
  }
  catch {
    throw new Error(`Environment variable ${key} must be valid JSON, got: ${value}`)
  }
}

/**
 * Validate required environment variables
 */
export function validateEnv(requiredVars: string[]): { missing: string[] } {
  const missing: string[] = []

  for (const varName of requiredVars) {
    if (!getEnv(varName)) {
      missing.push(varName)
    }
  }

  return { missing }
}

/**
 * Environment configuration helper
 */
export interface EnvConfig {
  [key: string]: {
    required?: boolean
    type?: 'string' | 'number' | 'boolean' | 'json'
    defaultValue?: any
  }
}

/**
 * Load environment configuration with type validation
 */
export function loadEnvConfig<T extends Record<string, any>>(config: EnvConfig): T {
  const result: any = {}
  const errors: string[] = []

  for (const [key, options] of Object.entries(config)) {
    try {
      let value: any

      switch (options.type) {
        case 'number':
          value = getEnvNumber(key, options.defaultValue)
          break
        case 'boolean':
          value = getEnvBoolean(key, options.defaultValue)
          break
        case 'json':
          value = getEnvJson(key, options.defaultValue)
          break
        default:
          value = getEnv(key, options.defaultValue)
      }

      if (options.required && (value === undefined || value === null || value === '')) {
        errors.push(`Required environment variable ${key} is missing`)
      }
      else {
        result[key] = value
      }
    }
    catch (error) {
      errors.push(`Invalid environment variable ${key}: ${(error as Error).message}`)
    }
  }

  if (errors.length > 0) {
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`)
  }

  return result as T
}

/**
 * Common environment patterns for Go Corp projects
 */
export const CommonEnvVars = {
  // Application
  NODE_ENV: () => getEnv('NODE_ENV', 'development'),
  PORT: () => getEnvNumber('PORT', 3000),
  HOST: () => getEnv('HOST', '0.0.0.0'),

  // Database
  DATABASE_URL: () => requireEnv('DATABASE_URL'),
  REDIS_URL: () => getEnv('REDIS_URL'),

  // Authentication
  JWT_SECRET: () => requireEnv('JWT_SECRET'),
  JWT_EXPIRES_IN: () => getEnv('JWT_EXPIRES_IN', '7d'),

  // External Services
  API_BASE_URL: () => getEnv('API_BASE_URL'),
  WEBHOOK_SECRET: () => getEnv('WEBHOOK_SECRET'),

  // Feature flags
  FEATURE_FLAGS: () => getEnvJson<Record<string, boolean>>('FEATURE_FLAGS', {}),

  // Logging
  LOG_LEVEL: () => getEnv('LOG_LEVEL', 'info'),
  LOG_FORMAT: () => getEnv('LOG_FORMAT', 'json'),

  // CORS
  ALLOWED_ORIGINS: () => {
    const origins = getEnv('ALLOWED_ORIGINS')
    return origins ? origins.split(',').map(s => s.trim()) : ['http://localhost:3000']
  },
} as const

/**
 * Development utilities
 */
export const DevUtils = {
  /**
   * Load .env file in development (Node.js only)
   */
  loadDotEnv: async () => {
    if (!isDev() || typeof process === 'undefined')
      return

    try {
      // Use eval to avoid TypeScript checking for optional dependency
      // eslint-disable-next-line no-eval
      const dotenv = await (0, eval)('import("dotenv")')
      dotenv.config()
    }
    catch {
      // dotenv not available, continue silently
    }
  },

  /**
   * Print environment info for debugging
   */
  printEnvInfo: () => {
    if (!isDev())
      return

    console.log('🌍 Environment Info:')
    console.log(`  NODE_ENV: ${getEnv('NODE_ENV')}`)
    console.log(`  Platform: ${typeof process !== 'undefined' ? 'Node.js' : 'Edge'}`)
    console.log(`  Port: ${getEnv('PORT') || 'Not set'}`)
  },
}
