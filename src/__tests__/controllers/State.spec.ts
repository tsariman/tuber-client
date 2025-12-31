import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import State from '../../controllers/State';
import { createMockRootState } from './test-utils';
import type { RootState } from '../../state';
import type { IState } from '../../interfaces/localized';

// Mock all the controller imports
vi.mock('../../controllers/StateAllPages', () => ({
  default: class MockStateAllPages {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateAllIcons', () => ({
  default: class MockStateAllIcons {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateBackground', () => ({
  default: class MockStateBackground {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateApp', () => ({
  default: class MockStateApp {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateDrawer', () => ({
  default: class MockStateDrawer {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateAllForms', () => ({
  default: class MockStateAllForms {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateFormsData', () => ({
  default: class MockStateFormsData {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateMeta', () => ({
  default: class MockStateMeta {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateTypography', () => ({
  default: class MockStateTypography {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateData', () => ({
  default: class MockStateData {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateDialog', () => ({
  default: class MockStateDialog {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateAllErrors', () => ({
  default: class MockStateAllErrors {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateAllDialogs', () => ({
  default: class MockStateAllDialogs {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StatePagesData', () => ({
  default: class MockStatePagesData {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateSnackbar', () => ({
  default: class MockStateSnackbar {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateTmp', () => ({
  default: class MockStateTmp {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateNet', () => ({
  default: class MockStateNet {
    public state: unknown;
    constructor(state: unknown) {
      this.state = state;
    }
  }
}));

vi.mock('../../controllers/templates/StateAppbarDefault', () => ({
  default: class MockStateAppbarDefault {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateAppbarQueries', () => ({
  default: class MockStateAppbarQueries {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateTopLevelLinks', () => ({
  default: class MockStateTopLevelLinks {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StateFormsDataErrors', () => ({
  default: class MockStateFormsDataErrors {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

vi.mock('../../controllers/StatePathnames', () => ({
  default: class MockStatePathnames {
    public state: unknown;
    constructor(state: unknown) {
      this.state = state;
    }
  }
}));

vi.mock('../../controllers/StateRegistry', () => ({
  default: class MockStateRegistry {
    public state: unknown;
    public parent: unknown;
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
  }
}));

describe('State', () => {
  let mockRootState: RootState;
  let state: State;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRootState = createMockRootState() as RootState;
    state = new State(mockRootState as any as IState);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('constructor', () => {
    it('should create a new State instance with root state', () => {
      expect(state).toBeInstanceOf(State);
      expect(state['_rootState']).toBe(mockRootState);
    });

    it('should initialize state version to current global version', () => {
      expect(state['_stateVersion']).toBe(State['_globalStateVersion']);
    });
  });

  describe('static factory method', () => {
    it('should create new State instance using fromRootState', () => {
      const newState = State.fromRootState(mockRootState as any);
      expect(newState).toBeInstanceOf(State);
      expect(newState['_rootState']).toBe(mockRootState);
    });
  });

  describe('version management', () => {
    it('should increment global state version', () => {
      const initialVersion = State['_globalStateVersion'];
      State.incrementVersion();
      expect(State['_globalStateVersion']).toBe(initialVersion + 1);
    });

    it('should detect stale instances after version increment', () => {
      const initiallyFresh = state['isStale']();
      expect(initiallyFresh).toBe(false);

      State.incrementVersion();
      const nowStale = state['isStale']();
      expect(nowStale).toBe(true);
    });

    it('should auto-invalidate cache when accessing stale state', () => {
      const invalidateSpy = vi.spyOn(state, 'invalidateCache');
      
      // Access some property to trigger cache check
      void state.app;
      expect(invalidateSpy).not.toHaveBeenCalled();

      // Make state stale and access again
      State.incrementVersion();
      void state.app;
      expect(invalidateSpy).toHaveBeenCalledOnce();
    });

    it('should update state version after invalidation', () => {
      State.incrementVersion();
      const newVersion = State['_globalStateVersion'];
      
      void state.app; // This should trigger invalidation and version update
      expect(state['_stateVersion']).toBe(newVersion);
    });
  });

  describe('AbstractState implementation', () => {
    it('should implement state getter (with warning)', () => {
      const result = state.state;
      expect(result).toBe(mockRootState);
    });

    it('should implement parent getter (with error)', () => {
      const result = state.parent;
      expect(result).toBeNull();
    });

    it('should implement props getter (with error)', () => {
      const result = state.props;
      expect(result).toBeNull();
    });

  });

  describe('controller getters', () => {
    it('should create and cache StateApp controller', () => {
      const app1 = state.app;
      const app2 = state.app;
      
      expect(app1).toBeDefined();
      expect(app1).toBe(app2); // Should be cached
    });

    it('should create and cache StateAppbar controller', () => {
      const appbar1 = state.appbar;
      const appbar2 = state.appbar;
      
      expect(appbar1).toBeDefined();
      expect(appbar1).toBe(appbar2);
    });

    it('should create and cache StateAppbarQueries controller', () => {
      const queries1 = state.appbarQueries;
      const queries2 = state.appbarQueries;
      
      expect(queries1).toBeDefined();
      expect(queries1).toBe(queries2);
    });

    it('should create and cache StateBackground controller', () => {
      const background1 = state.background;
      const background2 = state.background;
      
      expect(background1).toBeDefined();
      expect(background1).toBe(background2);
    });

    it('should create and cache StateTypography controller', () => {
      const typography1 = state.typography;
      const typography2 = state.typography;
      
      expect(typography1).toBeDefined();
      expect(typography1).toBe(typography2);
    });

    it('should create and cache StateAllIcons controller', () => {
      const icons1 = state.allIcons;
      const icons2 = state.allIcons;
      const icons3 = state.icons; // alias
      
      expect(icons1).toBeDefined();
      expect(icons1).toBe(icons2);
      expect(icons1).toBe(icons3);
    });

    it('should create and cache StateData controller', () => {
      const data1 = state.data;
      const data2 = state.data;
      
      expect(data1).toBeDefined();
      expect(data1).toBe(data2);
    });

    it('should create and cache StateDialog controller', () => {
      const dialog1 = state.dialog;
      const dialog2 = state.dialog;
      
      expect(dialog1).toBeDefined();
      expect(dialog1).toBe(dialog2);
    });

    it('should create and cache StateAllDialogs controller', () => {
      const dialogs1 = state.allDialogs;
      const dialogs2 = state.allDialogs;
      const dialogs3 = state.dialogs; // alias
      
      expect(dialogs1).toBeDefined();
      expect(dialogs1).toBe(dialogs2);
      expect(dialogs1).toBe(dialogs3);
    });

    it('should create and cache StateDrawer controller', () => {
      const drawer1 = state.drawer;
      const drawer2 = state.drawer;
      
      expect(drawer1).toBeDefined();
      expect(drawer1).toBe(drawer2);
    });

    it('should create and cache StateAllErrors controller', () => {
      const errors1 = state.allErrors;
      const errors2 = state.allErrors;
      const errors3 = state.errors; // alias
      
      expect(errors1).toBeDefined();
      expect(errors1).toBe(errors2);
      expect(errors1).toBe(errors3);
    });

    it('should create and cache StateAllForms controller', () => {
      const forms1 = state.allForms;
      const forms2 = state.allForms;
      const forms3 = state.forms; // alias
      
      expect(forms1).toBeDefined();
      expect(forms1).toBe(forms2);
      expect(forms1).toBe(forms3);
    });

    it('should create and cache StateFormsData controller', () => {
      const formsData1 = state.formsData;
      const formsData2 = state.formsData;
      
      expect(formsData1).toBeDefined();
      expect(formsData1).toBe(formsData2);
    });

    it('should create and cache StateFormsDataErrors controller', () => {
      const errors1 = state.formsDataErrors;
      const errors2 = state.formsDataErrors;
      
      expect(errors1).toBeDefined();
      expect(errors1).toBe(errors2);
    });

    it('should create and cache StateMeta controller', () => {
      const meta1 = state.meta;
      const meta2 = state.meta;
      
      expect(meta1).toBeDefined();
      expect(meta1).toBe(meta2);
    });

    it('should create and cache StateAllPages controller', () => {
      const pages1 = state.allPages;
      const pages2 = state.allPages;
      const pages3 = state.pages; // alias
      
      expect(pages1).toBeDefined();
      expect(pages1).toBe(pages2);
      expect(pages1).toBe(pages3);
    });

    it('should create and cache StatePagesData controller', () => {
      const pagesData1 = state.pagesData;
      const pagesData2 = state.pagesData;
      
      expect(pagesData1).toBeDefined();
      expect(pagesData1).toBe(pagesData2);
    });

    it('should create and cache StateSnackbar controller', () => {
      const snackbar1 = state.snackbar;
      const snackbar2 = state.snackbar;
      
      expect(snackbar1).toBeDefined();
      expect(snackbar1).toBe(snackbar2);
    });

    it('should create and cache StateTmp controller', () => {
      const tmp1 = state.tmp;
      const tmp2 = state.tmp;
      
      expect(tmp1).toBeDefined();
      expect(tmp1).toBe(tmp2);
    });

    it('should create and cache StateTopLevelLinks controller', () => {
      const links1 = state.topLevelLinks;
      const links2 = state.topLevelLinks;
      
      expect(links1).toBeDefined();
      expect(links1).toBe(links2);
    });

    it('should create and cache StateNet controller', () => {
      const net1 = state.net;
      const net2 = state.net;
      
      expect(net1).toBeDefined();
      expect(net1).toBe(net2);
    });

    it('should create and cache StatePathnames controller', () => {
      const pathnames1 = state.pathnames;
      const pathnames2 = state.pathnames;
      
      expect(pathnames1).toBeDefined();
      expect(pathnames1).toBe(pathnames2);
    });

    it('should create and cache StateRegistry controllers', () => {
      const static1 = state.staticRegistry;
      const static2 = state.staticRegistry;
      const dynamic1 = state.dynamicRegistry;
      const dynamic2 = state.dynamicRegistry;
      
      expect(static1).toBeDefined();
      expect(static1).toBe(static2);
      expect(dynamic1).toBeDefined();
      expect(dynamic1).toBe(dynamic2);
      expect(static1).not.toBe(dynamic1); // Should be different instances
    });
  });

  describe('cache invalidation', () => {
    it('should clear all cached controllers when invalidateCache is called', () => {
      // Create some controllers to cache them
      void state.app;
      void state.background;
      void state.dialog;
      void state.forms;
      
      // Verify they are cached
      expect(state['_app']).toBeDefined();
      expect(state['_background']).toBeDefined();
      expect(state['_dialog']).toBeDefined();
      expect(state['_allForms']).toBeDefined();
      
      // Invalidate cache
      state.invalidateCache();
      
      // Verify cache is cleared
      expect(state['_app']).toBeUndefined();
      expect(state['_background']).toBeUndefined();
      expect(state['_dialog']).toBeUndefined();
      expect(state['_allForms']).toBeUndefined();
    });

    it('should create new controller instances after cache invalidation', () => {
      const originalApp = state.app;
      const originalDialog = state.dialog;
      
      state.invalidateCache();
      
      const newApp = state.app;
      const newDialog = state.dialog;
      
      expect(newApp).not.toBe(originalApp);
      expect(newDialog).not.toBe(originalDialog);
    });
  });

  describe('controller dependency injection', () => {
    it('should pass correct state data to controllers', () => {
      const customAppState = { ...mockRootState.app, title: 'Custom App' };
      const customState = new State({ ...mockRootState, app: customAppState } as any);
      
      const appController = customState.app;
      expect(appController.state).toBe(customAppState);
      expect(appController.parent).toBe(customState);
    });

    it('should pass state instance as parent to controllers', () => {
      const dialog = state.dialog;
      expect(dialog.parent).toBe(state);
    });
  });

  describe('edge cases', () => {
    it('should handle empty root state gracefully', () => {
      const emptyState = new State({} as RootState);
      expect(() => emptyState.app).not.toThrow();
    });

    it('should maintain state integrity across multiple instances', () => {
      const state1 = new State(mockRootState as any);
      const state2 = new State(mockRootState as any);
      
      expect(state1).not.toBe(state2);
      expect(state1.app).not.toBe(state2.app);
    });
  });
});