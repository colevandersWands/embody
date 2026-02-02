import type { Config } from '../../types.js';
import detailed from '../detailed.js';
import exhaustive from '../exhaustive.js';
import overview from '../overview.js';

describe('preset configurations', () => {
  describe('overview', () => {
    describe('validity', () => {
      it('is valid Config object', () => {
        const overviewConfig: Config = overview;
        expect(overviewConfig).toBeDefined();
      });
    });

    describe('lang.bindings', () => {
      it('bindings is defined', () => {
        expect(overview.lang?.bindings).toBeDefined();
      });

      it('kind.declarative.var is defined', () => {
        expect(overview.lang?.bindings?.kind?.declarative?.var).toBeDefined();
      });

      it('kind.declarative.let is defined', () => {
        expect(overview.lang?.bindings?.kind?.declarative?.let).toBeDefined();
      });

      it('kind.declarative.const is defined', () => {
        expect(overview.lang?.bindings?.kind?.declarative?.const).toBeDefined();
      });
    });

    describe('lang.functions', () => {
      it('functions is defined', () => {
        expect(overview.lang?.functions).toBeDefined();
      });

      it('events.call is defined', () => {
        expect(overview.lang?.functions?.events?.call).toBeDefined();
      });
    });

    describe('lang.controlFlow', () => {
      it('controlFlow is defined', () => {
        expect(overview.lang?.controlFlow).toBeDefined();
      });

      it('kind.conditionals is defined', () => {
        expect(overview.lang?.controlFlow?.kind?.conditionals).toBeDefined();
      });
    });

    describe('advanced features disabled', () => {
      it('kind.implicit.global is falsy', () => {
        expect(overview.lang?.bindings?.kind?.implicit?.global).toBeFalsy();
      });

      it('operators.coercion is falsy', () => {
        expect(overview.lang?.operators?.coercion).toBeFalsy();
      });

      it('dynamic.eval is falsy', () => {
        expect(overview.lang?.dynamic?.eval).toBeFalsy();
      });
    });
  });

  describe('detailed', () => {
    describe('validity', () => {
      it('is valid Config object', () => {
        const detailedConfig: Config = detailed;
        expect(detailedConfig).toBeDefined();
      });
    });

    describe('lang.bindings extended', () => {
      it('bindings is defined', () => {
        expect(detailed.lang?.bindings).toBeDefined();
      });

      it('kind.declarative.var = true', () => {
        expect(detailed.lang?.bindings?.kind?.declarative?.var).toBe(true);
      });

      it('kind.declarative.let = true', () => {
        expect(detailed.lang?.bindings?.kind?.declarative?.let).toBe(true);
      });

      it('kind.declarative.const = true', () => {
        expect(detailed.lang?.bindings?.kind?.declarative?.const).toBe(true);
      });

      it('kind.declarative.function = true', () => {
        expect(detailed.lang?.bindings?.kind?.declarative?.function).toBe(true);
      });

      it('kind.declarative.class = true', () => {
        expect(detailed.lang?.bindings?.kind?.declarative?.class).toBe(true);
      });

      it('kind.explicit.parameters = true', () => {
        expect(detailed.lang?.bindings?.kind?.explicit?.parameters).toBe(true);
      });

      it('events.declare = true', () => {
        expect(detailed.lang?.bindings?.events?.declare).toBe(true);
      });

      it('events.read = true', () => {
        expect(detailed.lang?.bindings?.events?.read).toBe(true);
      });
    });

    describe('lang.controlFlow extended', () => {
      it('kind.loops.while = true', () => {
        expect(detailed.lang?.controlFlow?.kind?.loops?.while).toBe(true);
      });

      it('kind.loops.for.test = true', () => {
        expect(detailed.lang?.controlFlow?.kind?.loops?.for?.test).toBe(true);
      });

      it('kind.switch = true', () => {
        expect(detailed.lang?.controlFlow?.kind?.switch).toBe(true);
      });

      it('events.iteration = true', () => {
        expect(detailed.lang?.controlFlow?.events?.iteration).toBe(true);
      });
    });

    describe('lang.scopes enabled', () => {
      it('kind.block = true', () => {
        expect(detailed.lang?.scopes?.kind?.block).toBe(true);
      });

      it('kind.closure = true', () => {
        expect(detailed.lang?.scopes?.kind?.closure).toBe(true);
      });
    });

    describe('lang.operators enabled', () => {
      it('pure = true', () => {
        expect(detailed.lang?.operators?.pure).toBe(true);
      });

      it('mutating = true', () => {
        expect(detailed.lang?.operators?.mutating).toBe(true);
      });

      it('shortCircuiting = true', () => {
        expect(detailed.lang?.operators?.shortCircuiting).toBe(true);
      });
    });
  });

  describe('exhaustive', () => {
    describe('validity', () => {
      it('is valid Config object', () => {
        const exhaustiveConfig: Config = exhaustive;
        expect(exhaustiveConfig).toBeDefined();
      });
    });

    describe('lang.bindings all enabled', () => {
      it('bindings is defined', () => {
        expect(exhaustive.lang?.bindings).toBeDefined();
      });

      it('kind.declarative.var = true', () => {
        expect(exhaustive.lang?.bindings?.kind?.declarative?.var).toBe(true);
      });

      it('kind.declarative.let = true', () => {
        expect(exhaustive.lang?.bindings?.kind?.declarative?.let).toBe(true);
      });

      it('kind.declarative.const = true', () => {
        expect(exhaustive.lang?.bindings?.kind?.declarative?.const).toBe(true);
      });

      it('kind.declarative.function = true', () => {
        expect(exhaustive.lang?.bindings?.kind?.declarative?.function).toBe(true);
      });

      it('kind.declarative.class = true', () => {
        expect(exhaustive.lang?.bindings?.kind?.declarative?.class).toBe(true);
      });

      it('kind.declarative.import = true', () => {
        expect(exhaustive.lang?.bindings?.kind?.declarative?.import).toBe(true);
      });

      it('kind.implicit.global = true', () => {
        expect(exhaustive.lang?.bindings?.kind?.implicit?.global).toBe(true);
      });

      it('kind.implicit.this = true', () => {
        expect(exhaustive.lang?.bindings?.kind?.implicit?.this).toBe(true);
      });

      it('kind.implicit.arguments = true', () => {
        expect(exhaustive.lang?.bindings?.kind?.implicit?.arguments).toBe(true);
      });

      it('events.declare = true', () => {
        expect(exhaustive.lang?.bindings?.events?.declare).toBe(true);
      });

      it('events.available = true', () => {
        expect(exhaustive.lang?.bindings?.events?.available).toBe(true);
      });

      it('events.initialize = true', () => {
        expect(exhaustive.lang?.bindings?.events?.initialize).toBe(true);
      });

      it('events.read = true', () => {
        expect(exhaustive.lang?.bindings?.events?.read).toBe(true);
      });
    });

    describe('advanced features enabled', () => {
      it('operators.coercion = true', () => {
        expect(exhaustive.lang?.operators?.coercion).toBe(true);
      });

      it('operators.comma = true', () => {
        expect(exhaustive.lang?.operators?.comma).toBe(true);
      });

      it('scopes.kind.closure = true', () => {
        expect(exhaustive.lang?.scopes?.kind?.closure).toBe(true);
      });

      it('properties.lookup = true', () => {
        expect(exhaustive.lang?.properties?.lookup).toBe(true);
      });

      it('dynamic.eval = true', () => {
        expect(exhaustive.lang?.dynamic?.eval).toBe(true);
      });

      it('dynamic.function = true', () => {
        expect(exhaustive.lang?.dynamic?.function).toBe(true);
      });

      it('meta.proxy = true', () => {
        expect(exhaustive.lang?.meta?.proxy).toBe(true);
      });

      it('meta.reflect = true', () => {
        expect(exhaustive.lang?.meta?.reflect).toBe(true);
      });
    });

    describe('debug features enabled', () => {
      it('meta.debug.configPath = true', () => {
        expect(exhaustive.meta?.debug?.configPath).toBe(true);
      });

      it('meta.debug.AranNodeId = true', () => {
        expect(exhaustive.meta?.debug?.AranNodeId).toBe(true);
      });

      it('meta.debug.adviceName = true', () => {
        expect(exhaustive.meta?.debug?.adviceName).toBe(true);
      });
    });

    describe('matching features enabled', () => {
      it('matching.read.spread = true', () => {
        expect(exhaustive.lang?.matching?.read?.spread).toBe(true);
      });

      it('matching.assign.destructure = true', () => {
        expect(exhaustive.lang?.matching?.assign?.destructure).toBe(true);
      });

      it('matching.assign.rest = true', () => {
        expect(exhaustive.lang?.matching?.assign?.rest).toBe(true);
      });

      it('matching.assign.defaultValues = true', () => {
        expect(exhaustive.lang?.matching?.assign?.defaultValues).toBe(true);
      });
    });
  });
});
