import { describe, it, expect } from 'vitest'
import { 
  incrementVersion,
  analyzeChangesForVersionBump,
  COLORS
} from '../src/node/git-utils.js'

describe('Git Utilities', () => {
  describe('incrementVersion', () => {
    it('should increment patch version', () => {
      expect(incrementVersion('1.2.3', 'patch')).toBe('1.2.4')
    })

    it('should increment minor version', () => {
      expect(incrementVersion('1.2.3', 'minor')).toBe('1.3.0')
    })

    it('should increment major version', () => {
      expect(incrementVersion('1.2.3', 'major')).toBe('2.0.0')
    })

    it('should handle single digit versions', () => {
      expect(incrementVersion('0.0.1', 'patch')).toBe('0.0.2')
      expect(incrementVersion('0.1.0', 'minor')).toBe('0.2.0')
      expect(incrementVersion('1.0.0', 'major')).toBe('2.0.0')
    })
  })

  describe('COLORS', () => {
    it('should have all required color constants', () => {
      expect(COLORS.reset).toBe('\x1b[0m')
      expect(COLORS.red).toBe('\x1b[31m')
      expect(COLORS.green).toBe('\x1b[32m')
      expect(COLORS.yellow).toBe('\x1b[33m')
    })
  })

  // Note: Most git utilities require a git repository and would need more complex mocking
  // These tests focus on the pure functions that don't require git commands
})