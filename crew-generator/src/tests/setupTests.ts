import '@testing-library/jest-dom'

// Mock IntersectionObserver for tests
global.IntersectionObserver = class IntersectionObserver {
  observe() {
    return null
  }
  
  disconnect() {
    return null
  }
  
  unobserve() {
    return null
  }
}

// Mock ResizeObserver for tests  
global.ResizeObserver = class ResizeObserver {
  observe() {
    return null
  }
  
  disconnect() {
    return null
  }
  
  unobserve() {
    return null
  }
}

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
})

// Mock env() for safe-area-inset testing
const originalGetComputedStyle = window.getComputedStyle
window.getComputedStyle = (element, pseudoElement) => {
  const styles = originalGetComputedStyle(element, pseudoElement)
  // Mock safe area insets for testing
  if (element.style && element.style.paddingBottom === 'env(safe-area-inset-bottom)') {
    ;(styles as any).paddingBottom = '34px' // Mock iPhone bottom safe area
  }
  return styles
}
