import { useEffect } from 'react';

// Singleton logic to prevent multiple rapid pushes
let isNavigating = false;

export const navigateToSection = (e?: React.MouseEvent<any>, href?: string) => {
  if (e) {
    e.preventDefault();
  }
  
  if (!href) return;
  
  let targetId = href.replace('#', '');
  if (targetId === 'why-us') targetId = 'whyus';
  if (!targetId || targetId === '') targetId = 'home';
  
  // Close the mobile menu if it is exposed globally, but we handle that in Navbar.tsx
  // We dispatch an event so Navbar can close it if open
  window.dispatchEvent(new CustomEvent('close-mobile-menu'));

  // Only push state if we are actually changing the logical section URL
  if (window.location.hash !== '#' + targetId && !isNavigating) {
    isNavigating = true;
    window.history.pushState({ __aiMetaWorld: true, type: 'section', sectionId: targetId }, '', '#' + targetId);
    setTimeout(() => { isNavigating = false; }, 300);
  }
  
  const el = document.getElementById(targetId);
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY;
    // Debounce slightly to ensure rendering updates have caught up
    setTimeout(() => {
      window.scrollTo({ top: top - 80, behavior: 'smooth' });
    }, 10);
  } else if (targetId === 'home') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

export const pushNestedState = (parentSection: string, nestedType: string, nestedId: string | number, hashUrl?: string) => {
  const currentState = window.history.state;
  if (currentState && currentState.type === nestedType && String(currentState.nestedId) === String(nestedId)) {
    return; // Already in this state
  }
  
  window.history.pushState(
    { __aiMetaWorld: true, type: nestedType, parentSection, nestedId: String(nestedId) },
    '',
    hashUrl || `#${parentSection}`
  );
};

export const useNavigationManager = () => {
  useEffect(() => {
    // Initial Load - set baseline state safely
    if (!window.history.state || !window.history.state.__aiMetaWorld) {
      let initialId = window.location.hash.replace('#', '');
      if (initialId === 'why-us') initialId = 'whyus';
      if (!initialId || initialId === '') initialId = 'home';
      
      // Do not replace if it's a project deep link, Portfolio will handle that
      if (!initialId.startsWith('project-')) {
        // Create an invisible 'entry' state to intercept back navigation from exiting the app when scrolled
        window.history.replaceState(
          { __aiMetaWorld: true, type: 'entry' }, 
          '', 
          window.location.hash || '#' + initialId
        );
        // Then push the actual active section state
        window.history.pushState(
          { __aiMetaWorld: true, type: 'section', sectionId: initialId }, 
          '', 
          window.location.hash || '#' + initialId
        );
      }
    }

    const handlePopState = (e: PopStateEvent) => {
      const state = e.state;
      
      if (state && state.__aiMetaWorld) {
        if (state.type === 'entry') {
          if (window.scrollY > 50) {
            // User pressed Back to leave the site, but they were scrolled down.
            // Intercept: scroll to top instead.
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Re-push the section state so they can press Back again to actually leave if they want
            let currentId = 'home';
            
            const newState = { __aiMetaWorld: true, type: 'section', sectionId: currentId };
            window.history.pushState(
              newState,
              '',
              '#' + currentId
            );
            
            // Inform the rest of the app (Navbar, etc.) that we are back at Home
            window.dispatchEvent(new CustomEvent('sync-navigation-state', { detail: newState }));
          } else {
            // User is already at the top. Let them leave the site immediately.
            window.history.back();
          }
          return;
        }

        // Dispatch unified event for ALL nested states to sync
        window.dispatchEvent(new CustomEvent('sync-navigation-state', { detail: state }));
        
        if (state.type === 'section') {
          // If we popped back to a parent section, scroll to it
          const el = document.getElementById(state.sectionId);
          if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY;
            window.scrollTo({ top: top - 80, behavior: 'smooth' });
          } else if (state.sectionId === 'home') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }
      } else {
        // Fallback for native external previous states or blank hashes
        window.dispatchEvent(new CustomEvent('sync-navigation-state', { detail: { type: 'fallback' } }));
        if (!window.location.hash || window.location.hash === '') {
           window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
};
