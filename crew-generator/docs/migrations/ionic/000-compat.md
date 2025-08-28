# Ionic React Compatibility Report

**Date:** 2025-08-28  
**Branch:** feat/ionic-integration  
**Engineer:** @battist  

## Current Stack Versions

- **React:** 19.1.1
- **React DOM:** 19.1.1  
- **React Router DOM:** 7.8.0

## Ionic Dependencies Analysis

### Successfully Installed
- **@ionic/react:** 8.7.3 ✅
- **ionicons:** 7.4.0 ✅

### Compatibility Issue Identified
- **@ionic/react-router:** 8.7.3 ❌ (not installed)

#### Peer Dependencies Conflict
```json
{
  "react": ">=16.8.6",           // ✅ Compatible (19.1.1)
  "react-dom": ">=16.8.6",      // ✅ Compatible (19.1.1)  
  "react-router": "^5.0.1",     // ❌ We don't use react-router directly
  "react-router-dom": "^5.0.1"  // ❌ Major version mismatch (we have 7.8.0)
}
```

## Decision: Path B (Fallback Strategy)

Per the [PLAYBOOK.md](./PLAYBOOK.md), we're adopting **Path B** due to the React Router DOM version incompatibility:

### What This Means
- ✅ **Keep:** `BrowserRouter` from React Router DOM v7
- ✅ **Adopt:** `IonApp`, `IonPage`, `IonContent` for mobile UX
- ✅ **Adopt:** Ionic components (tabs, modals, action sheets, etc.)
- ❌ **Skip for now:** `IonReactRouter` + `IonRouterOutlet` 
- ❌ **Skip for now:** Native-like page transitions

### Migration Path Forward
1. **Phase 1 (Current):** Bootstrap Ionic CSS + `setupIonicReact()`
2. **Phase 2:** Wrap existing pages in `IonPage`/`IonContent`
3. **Phase 3:** Implement Ionic tabs shell with `BrowserRouter`
4. **Phase 4:** Add mobile primitives (pull-to-refresh, infinite scroll, etc.)
5. **Phase 5 (Future):** Evaluate upgrading to `IonReactRouter` when compatibility improves

## Risk Assessment

### Low Risk ✅
- Core Ionic components work fine with any router
- Mobile UX improvements available immediately
- Design system integration remains intact

### Medium Risk ⚠️
- Missing native-like page transitions
- Some Ionic routing features unavailable
- May need custom back button handling

### Mitigation Strategy
- Monitor `@ionic/react-router` releases for React Router v7 support
- Document transition workarounds in `001-router.md`
- Plan router migration as separate milestone

## Next Steps

1. Bootstrap Ionic CSS and `setupIonicReact()` in `main.tsx`
2. Create `src/theme/ionic-overrides.css` for design token mapping
3. Begin wrapping pages with `IonPage`/`IonContent`
4. Document router-specific notes in `001-router.md`

## References

- [Ionic React Router Docs](https://ionicframework.com/docs/react/navigation)
- [React Router v7 Migration Guide](https://reactrouter.com/en/main/upgrading/v6-to-v7)
- Project PLAYBOOK: `docs/migrations/ionic/PLAYBOOK.md`
