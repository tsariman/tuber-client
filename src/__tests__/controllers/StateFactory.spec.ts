import { describe, it, expect, vi, beforeEach } from 'vitest';
import './setup-mocks'; // Import centralized mocks
import StateFactory from '../../controllers/StateFactory';
import { createMockRootState } from './test-utils';
import type { RootState } from '../../state';

// Mock all the controller classes
vi.mock('../../controllers/StateApp', () => ({
  default: class MockStateApp {
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
    state: unknown;
    parent: unknown;
  }
}));

vi.mock('../../controllers/templates/StateAppbarDefault', () => ({
  default: class MockStateAppbarDefault {
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
    state: unknown;
    parent: unknown;
  }
}));

vi.mock('../../controllers/StateAppbarQueries', () => ({
  default: class MockStateAppbarQueries {
    constructor(state: unknown, parent: unknown) {
      this.state = state;
      this.parent = parent;
    }
    state: unknown;
    parent: unknown;
  }
}));

vi.mock('../../controllers/StateBackground', () => ({
  default: class MockStateBackground {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateTypography', () => ({
  default: class MockStateTypography {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateAllIcons', () => ({
  default: class MockStateAllIcons {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateData', () => ({
  default: class MockStateData {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateDialog', () => ({
  default: class MockStateDialog {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateAllDialogs', () => ({
  default: class MockStateAllDialogs {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateDrawer', () => ({
  default: class MockStateDrawer {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateAllErrors', () => ({
  default: class MockStateAllErrors {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateAllForms', () => ({
  default: class MockStateAllForms {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateFormsData', () => ({
  default: class MockStateFormsData {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateFormsDataErrors', () => ({
  default: class MockStateFormsDataErrors {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateMeta', () => ({
  default: class MockStateMeta {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateAllPages', () => ({
  default: class MockStateAllPages {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StatePagesData', () => ({
  default: class MockStatePagesData {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateSnackbar', () => ({
  default: class MockStateSnackbar {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateTmp', () => ({
  default: class MockStateTmp {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateTopLevelLinks', () => ({
  default: class MockStateTopLevelLinks {
    constructor(state: unknown, parent: unknown) { this.state = state; this.parent = parent; } state: unknown; parent: unknown;
  }
}));

vi.mock('../../controllers/StateNet', () => ({
  default: class MockStateNet {
    constructor(state: unknown) { this.state = state; } state: unknown;
  }
}));

vi.mock('../../controllers/StatePathnames', () => ({
  default: class MockStatePathnames {
    constructor(state: unknown) { this.state = state; } state: unknown;
  }
}));

// Mock State class
vi.mock('../../controllers/State', () => ({
  default: class MockState {
    constructor(rootState: RootState) { 
      this.rootState = rootState; 
      this.state = rootState;
    } 
    rootState: RootState;
    state: RootState;
    static fromRootState = vi.fn();
  }
}));

describe('StateFactory', () => {
  let mockRootState: RootState;
  let mockGetState: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockRootState = createMockRootState() as RootState;
    
    // Get the mocked get_state function
    const stateMocks = await vi.importMock('../../state') as { get_state: ReturnType<typeof vi.fn> };
    mockGetState = stateMocks.get_state;
    mockGetState.mockReturnValue(mockRootState);
    
    // Reset static state between tests
    StateFactory['__rootState'] = undefined;
    StateFactory['__parent'] = undefined;
  });

  describe('static initialization', () => {
    it('should lazy-load root state from get_state', () => {
      // Access private _rootState getter to trigger get_state call
      const rootState = StateFactory['_rootState'];
      expect(mockGetState).toHaveBeenCalledOnce();
      expect(rootState).toBe(mockRootState);
    });

    it('should lazy-load parent State instance', () => {
      const parent = StateFactory['_parent'];
      expect(parent).toBeDefined();
      expect(parent.state).toBe(mockRootState);
    });

    it('should expose parent getter', () => {
      const parent = StateFactory.parent;
      expect(parent).toBeDefined();
    });
  });

  describe('controller factory methods', () => {
    it('should create StateApp controller', () => {
      const stateApp = StateFactory.createStateApp();
      expect(stateApp).toBeDefined();
      expect(stateApp.state).toBe(mockRootState.app);
      expect(stateApp.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateAppbarDefault controller', () => {
      const stateAppbar = StateFactory.createStateAppbarDefault();
      expect(stateAppbar).toBeDefined();
      expect(stateAppbar.state).toBe(mockRootState.appbar);
      expect(stateAppbar.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateAppbarQueries controller', () => {
      const stateAppbarQueries = StateFactory.createStateAppbarQueries();
      expect(stateAppbarQueries).toBeDefined();
      expect(stateAppbarQueries.state).toBe(mockRootState.appbarQueries);
      expect(stateAppbarQueries.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateBackground controller', () => {
      const stateBackground = StateFactory.createStateBackground();
      expect(stateBackground).toBeDefined();
      expect(stateBackground.state).toBe(mockRootState.background);
      expect(stateBackground.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateTypography controller', () => {
      const stateTypography = StateFactory.createStateTypography();
      expect(stateTypography).toBeDefined();
      expect(stateTypography.state).toBe(mockRootState.typography);
      expect(stateTypography.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateAllIcons controller', () => {
      const stateAllIcons = StateFactory.createStateAllIcons();
      expect(stateAllIcons).toBeDefined();
      expect(stateAllIcons.state).toBe(mockRootState.icons);
      expect(stateAllIcons.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateData controller', () => {
      const stateData = StateFactory.createStateData();
      expect(stateData).toBeDefined();
      expect(stateData.state).toBe(mockRootState.data);
      expect(stateData.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateDialog controller', () => {
      const stateDialog = StateFactory.createStateDialog();
      expect(stateDialog).toBeDefined();
      expect(stateDialog.state).toBe(mockRootState.dialog);
      expect(stateDialog.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateAllDialogs controller', () => {
      const stateAllDialogs = StateFactory.createStateAllDialogs();
      expect(stateAllDialogs).toBeDefined();
      expect(stateAllDialogs.state).toBe(mockRootState.dialogs);
      expect(stateAllDialogs.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateDrawer controller', () => {
      const stateDrawer = StateFactory.createStateDrawer();
      expect(stateDrawer).toBeDefined();
      expect(stateDrawer.state).toBe(mockRootState.drawer);
      expect(stateDrawer.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateAllErrors controller', () => {
      const stateAllErrors = StateFactory.createStateAllErrors();
      expect(stateAllErrors).toBeDefined();
      expect(stateAllErrors.state).toBe(mockRootState.errors);
      expect(stateAllErrors.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateAllForms controller', () => {
      const stateAllForms = StateFactory.createStateAllForms();
      expect(stateAllForms).toBeDefined();
      expect(stateAllForms.state).toBe(mockRootState.forms);
      expect(stateAllForms.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateFormsData controller', () => {
      const stateFormsData = StateFactory.createStateFormsData();
      expect(stateFormsData).toBeDefined();
      expect(stateFormsData.state).toBe(mockRootState.formsData);
      expect(stateFormsData.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateFormsDataErrors controller', () => {
      const stateFormsDataErrors = StateFactory.createStateFormsDataErrors();
      expect(stateFormsDataErrors).toBeDefined();
      expect(stateFormsDataErrors.state).toBe(mockRootState.formsDataErrors);
      expect(stateFormsDataErrors.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateMeta controller', () => {
      const stateMeta = StateFactory.createStateMeta();
      expect(stateMeta).toBeDefined();
      expect(stateMeta.state).toBe(mockRootState.meta);
      expect(stateMeta.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateAllPages controller', () => {
      const stateAllPages = StateFactory.createStateAllPages();
      expect(stateAllPages).toBeDefined();
      expect(stateAllPages.state).toBe(mockRootState.pages);
      expect(stateAllPages.parent).toBe(StateFactory['_parent']);
    });

    it('should create StatePagesData controller', () => {
      const statePagesData = StateFactory.createStatePagesData();
      expect(statePagesData).toBeDefined();
      expect(statePagesData.state).toBe(mockRootState.pagesData);
      expect(statePagesData.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateSnackbar controller', () => {
      const stateSnackbar = StateFactory.createStateSnackbar();
      expect(stateSnackbar).toBeDefined();
      expect(stateSnackbar.state).toBe(mockRootState.snackbar);
      expect(stateSnackbar.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateTmp controller', () => {
      const stateTmp = StateFactory.createStateTmp();
      expect(stateTmp).toBeDefined();
      expect(stateTmp.state).toBe(mockRootState.tmp);
      expect(stateTmp.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateTopLevelLinks controller', () => {
      const stateTopLevelLinks = StateFactory.createStateTopLevelLinks();
      expect(stateTopLevelLinks).toBeDefined();
      expect(stateTopLevelLinks.state).toBe(mockRootState.topLevelLinks);
      expect(stateTopLevelLinks.parent).toBe(StateFactory['_parent']);
    });

    it('should create StateNet controller (without parent)', () => {
      const stateNet = StateFactory.createStateNet();
      expect(stateNet).toBeDefined();
      expect(stateNet.state).toBe(mockRootState.net);
      // StateNet doesn't take a parent parameter
    });

    it('should create StatePathnames controller (without parent)', () => {
      const statePathnames = StateFactory.createStatePathnames();
      expect(statePathnames).toBeDefined();
      expect(statePathnames.state).toBe(mockRootState.pathnames);
      // StatePathnames doesn't take a parent parameter
    });
  });

  describe('dependency injection', () => {
    it('should inject the same parent State instance to all controllers', () => {
      const stateApp = StateFactory.createStateApp();
      const stateDialog = StateFactory.createStateDialog();
      const stateBackground = StateFactory.createStateBackground();
      
      expect(stateApp.parent).toBe(stateDialog.parent);
      expect(stateDialog.parent).toBe(stateBackground.parent);
      expect(stateBackground.parent).toBe(StateFactory['_parent']);
    });

    it('should inject the correct state data to each controller', () => {
      const customRootState = createMockRootState({
        app: { title: 'Custom App' } as any,
        dialog: { open: true } as any,
        background: { color: '#custom' } as any,
      });
      
      mockGetState.mockReturnValue(customRootState);
      // Reset static state to pick up the new mock
      StateFactory['__rootState'] = undefined;
      StateFactory['__parent'] = undefined;
      
      const stateApp = StateFactory.createStateApp();
      const stateDialog = StateFactory.createStateDialog();
      const stateBackground = StateFactory.createStateBackground();
      
      expect(stateApp.state).toBe(customRootState.app);
      expect(stateDialog.state).toBe(customRootState.dialog);
      expect(stateBackground.state).toBe(customRootState.background);
    });
  });

  describe('caching behavior', () => {
    it('should cache root state access', () => {
      // Access root state multiple times to test caching
      void StateFactory['_rootState'];
      void StateFactory['_rootState'];
      void StateFactory['_rootState'];
      
      // get_state should only be called once due to caching
      expect(mockGetState).toHaveBeenCalledOnce();
    });

    it('should cache parent State instance', () => {
      const parent1 = StateFactory['_parent'];
      const parent2 = StateFactory['_parent'];
      
      expect(parent1).toBe(parent2);
    });

    it('should create new controller instances on each call', () => {
      const stateApp1 = StateFactory.createStateApp();
      const stateApp2 = StateFactory.createStateApp();
      
      expect(stateApp1).not.toBe(stateApp2);
      expect(stateApp1.state).toBe(stateApp2.state); // Same state data
      expect(stateApp1.parent).toBe(stateApp2.parent); // Same parent
    });
  });

  describe('generic type support', () => {
    it('should support generic StateDrawer type parameter', () => {
      const stateDrawer = StateFactory.createStateDrawer<string>();
      expect(stateDrawer).toBeDefined();
      expect(stateDrawer.state).toBe(mockRootState.drawer);
    });
  });

  describe('error handling', () => {
    it('should handle missing state properties gracefully', () => {
      const incompleteState = {} as RootState;
      mockGetState.mockReturnValue(incompleteState);
      // Reset static state to pick up the new mock
      StateFactory['__rootState'] = undefined;
      StateFactory['__parent'] = undefined;
      
      expect(() => StateFactory.createStateApp()).not.toThrow();
      expect(() => StateFactory.createStateDialog()).not.toThrow();
      expect(() => StateFactory.createStateBackground()).not.toThrow();
    });
  });

  describe('factory pattern benefits', () => {
    it('should eliminate circular dependencies by centralizing creation', () => {
      // This test demonstrates that StateFactory can create controllers
      // without each controller needing to import the others
      const controllers = [
        StateFactory.createStateApp(),
        StateFactory.createStateDialog(),
        StateFactory.createStateBackground(),
        StateFactory.createStateTypography(),
      ];
      
      controllers.forEach(controller => {
        expect(controller).toBeDefined();
        expect(controller.parent).toBe(StateFactory['_parent']);
      });
    });

    it('should provide consistent state and parent injection', () => {
      // All controllers should receive the same state data and parent reference
      const controllers = [
        StateFactory.createStateApp(),
        StateFactory.createStateAllForms(),
        StateFactory.createStateAllPages(),
        StateFactory.createStateMeta(),
      ];
      
      const parentInstances = controllers.map(c => c.parent);
      const firstParent = parentInstances[0];
      
      expect(parentInstances.every(parent => parent === firstParent)).toBe(true);
    });
  });
});
