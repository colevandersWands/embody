/**
 * @file TDD tests for preset configurations
 * Tests that presets match the new Config structure
 */

import type { Config } from '../types.js';
import overview from './overview.js';
import detailed from './detailed.js';
import exhaustive from './exhaustive.js';

describe('Preset Configurations', () => {
  describe('Overview Preset', () => {
    test('should be valid Config object', () => {
      const overviewConfig: Config = overview;
      expect(overviewConfig).toBeDefined();
    });

    test('should have lang.bindings configuration', () => {
      expect(overview.lang?.bindings).toBeDefined();
      // Overview preset should enable basic variable tracking
      expect(overview.lang?.bindings?.kind?.declarative?.var).toBeDefined();
      expect(overview.lang?.bindings?.kind?.declarative?.let).toBeDefined();
      expect(overview.lang?.bindings?.kind?.declarative?.const).toBeDefined();
    });

    test('should have lang.functions configuration', () => {
      expect(overview.lang?.functions).toBeDefined();
      expect(overview.lang?.functions?.events?.call).toBeDefined();
    });

    test('should have lang.controlFlow configuration', () => {
      expect(overview.lang?.controlFlow).toBeDefined();
      expect(overview.lang?.controlFlow?.kind?.conditionals).toBeDefined();
    });

    test('should disable advanced features', () => {
      // Overview should not track complex features
      expect(overview.lang?.bindings?.kind?.implicit?.global).toBeFalsy();
      expect(overview.lang?.operators?.coercion).toBeFalsy();
      expect(overview.lang?.dynamic?.eval).toBeFalsy();
    });
  });

  describe('Detailed Preset', () => {
    test('should be valid Config object', () => {
      const detailedConfig: Config = detailed;
      expect(detailedConfig).toBeDefined();
    });

    test('should enable more bindings than overview', () => {
      expect(detailed.lang?.bindings).toBeDefined();
      // Detailed should track all declarative bindings
      expect(detailed.lang?.bindings?.kind?.declarative?.var).toBe(true);
      expect(detailed.lang?.bindings?.kind?.declarative?.let).toBe(true);
      expect(detailed.lang?.bindings?.kind?.declarative?.const).toBe(true);
      expect(detailed.lang?.bindings?.kind?.declarative?.function).toBe(true);
      expect(detailed.lang?.bindings?.kind?.declarative?.class).toBe(true);

      // Should track parameters
      expect(detailed.lang?.bindings?.kind?.explicit?.parameters).toBe(true);

      // Should track hoisting events
      expect(detailed.lang?.bindings?.events?.declare).toBe(true);
      expect(detailed.lang?.bindings?.events?.read).toBe(true);
    });

    test('should enable loops and more control flow', () => {
      expect(detailed.lang?.controlFlow?.kind?.loops?.while).toBe(true);
      expect(detailed.lang?.controlFlow?.kind?.loops?.for?.test).toBe(true);
      expect(detailed.lang?.controlFlow?.kind?.switch).toBe(true);
      expect(detailed.lang?.controlFlow?.events?.iteration).toBe(true);
    });

    test('should enable block scopes and closures', () => {
      expect(detailed.lang?.scopes?.kind?.block).toBe(true);
      expect(detailed.lang?.scopes?.kind?.closure).toBe(true);
    });

    test('should enable operators', () => {
      expect(detailed.lang?.operators?.pure).toBe(true);
      expect(detailed.lang?.operators?.mutating).toBe(true);
      expect(detailed.lang?.operators?.shortCircuiting).toBe(true);
    });
  });

  describe('Exhaustive Preset', () => {
    test('should be valid Config object', () => {
      const exhaustiveConfig: Config = exhaustive;
      expect(exhaustiveConfig).toBeDefined();
    });

    test('should enable ALL bindings features', () => {
      expect(exhaustive.lang?.bindings).toBeDefined();

      // All declarative bindings
      expect(exhaustive.lang?.bindings?.kind?.declarative?.var).toBe(true);
      expect(exhaustive.lang?.bindings?.kind?.declarative?.let).toBe(true);
      expect(exhaustive.lang?.bindings?.kind?.declarative?.const).toBe(true);
      expect(exhaustive.lang?.bindings?.kind?.declarative?.function).toBe(true);
      expect(exhaustive.lang?.bindings?.kind?.declarative?.class).toBe(true);
      expect(exhaustive.lang?.bindings?.kind?.declarative?.import).toBe(true);

      // All implicit bindings
      expect(exhaustive.lang?.bindings?.kind?.implicit?.global).toBe(true);
      expect(exhaustive.lang?.bindings?.kind?.implicit?.this).toBe(true);
      expect(exhaustive.lang?.bindings?.kind?.implicit?.arguments).toBe(true);

      // All events
      expect(exhaustive.lang?.bindings?.events?.declare).toBe(true);
      expect(exhaustive.lang?.bindings?.events?.available).toBe(true);
      expect(exhaustive.lang?.bindings?.events?.initialize).toBe(true);
      expect(exhaustive.lang?.bindings?.events?.read).toBe(true);
    });

    test('should enable ALL advanced features', () => {
      // Advanced operators
      expect(exhaustive.lang?.operators?.coercion).toBe(true);
      expect(exhaustive.lang?.operators?.comma).toBe(true);

      // Advanced scope features
      expect(exhaustive.lang?.scopes?.kind?.closure).toBe(true);

      // Prototype lookup
      expect(exhaustive.lang?.properties?.lookup).toBe(true);

      // Dynamic code
      expect(exhaustive.lang?.dynamic?.eval).toBe(true);
      expect(exhaustive.lang?.dynamic?.function).toBe(true);

      // Meta programming
      expect(exhaustive.lang?.meta?.proxy).toBe(true);
      expect(exhaustive.lang?.meta?.reflect).toBe(true);
    });

    test('should enable debug features', () => {
      expect(exhaustive.meta?.debug?.configPath).toBe(true);
      expect(exhaustive.meta?.debug?.AranNodeId).toBe(true);
      expect(exhaustive.meta?.debug?.adviceName).toBe(true);
    });

    test('should enable all matching features', () => {
      expect(exhaustive.lang?.matching?.read?.spread).toBe(true);
      expect(exhaustive.lang?.matching?.assign?.destructure).toBe(true);
      expect(exhaustive.lang?.matching?.assign?.rest).toBe(true);
      expect(exhaustive.lang?.matching?.assign?.defaultValues).toBe(true);
    });
  });
});