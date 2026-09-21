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

export const useNavigationManager = () => {
  useEffect(() => {
    // 1. Initial Load - set baseline state safely
    if (!window.history.state || !window.history.state.__aiMetaWorld) {
      let initialId = window.location.hash.replace('#', '');
      if (initialId === 'why-us') initialId = 'whyus';
      if (!initialId || initialId === '') initialId = 'home';
      
      // Do not replace if it's a project deep link, Portfolio will handle that
      if (!initialId.startsWith('project-')) {
        window.history.replaceState(
          { __aiMetaWorld: true, type: 'section', sectionId: initialId }, 
          '', 
          window.location.hash || '#' + initialId
        );
      }
    }

    // 2. Popstate Listener - handles the BACK and FORWARD buttons natively
    const handlePopState = (e: PopStateEvent) => {
      const state = e.state;
      
      if (state && state.__aiMetaWorld) {
        if (state.type === 'section') {
          // If we popped back to a section, ensure any open project modal closes
          window.dispatchEvent(new CustomEvent('close-project-modal'));
          
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
        if (!window.location.hash || window.location.hash === '') {
           window.dispatchEvent(new CustomEvent('close-project-modal'));
           window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);
};
