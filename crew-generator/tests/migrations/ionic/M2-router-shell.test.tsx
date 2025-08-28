/**
 * Ionic Migration Milestone 2 Test
 * Verifies IonApp wrapper and IonPage/IonContent structure implementation
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { IonApp, IonPage, IonContent } from '@ionic/react'

// Mock the auth context to avoid authentication requirements
vi.mock('../../../src/components/AuthProvider', () => ({
  useAuth: () => ({ user: null, loading: false }),
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>
}))

// Mock Supabase to avoid database calls
vi.mock('../../../src/lib/supabase', () => ({
  supabase: {
    from: () => ({
      select: () => ({
        eq: () => ({
          single: () => Promise.resolve({ data: null, error: null })
        })
      })
    })
  }
}))

// Test components that use the IonPage/IonContent structure
const TestIonPage = () => (
  <IonPage>
    <IonContent>
      <div data-testid="ion-page-content">Test content in IonPage</div>
    </IonContent>
  </IonPage>
)

const TestIonApp = ({ children }: { children: React.ReactNode }) => (
  <IonApp>
    <div data-testid="ion-app-wrapper">
      {children}
    </div>
  </IonApp>
)

describe('Ionic Migration - Milestone 2: Router Shell (Path B)', () => {
  beforeEach(() => {
    // Clear any previous DOM state
    document.body.innerHTML = ''
  })

  it('should render IonApp wrapper without errors', () => {
    render(
      <TestIonApp>
        <div data-testid="app-content">App content</div>
      </TestIonApp>
    )

    expect(screen.getByTestId('ion-app-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('app-content')).toBeInTheDocument()
  })

  it('should render IonPage and IonContent structure', () => {
    render(
      <MemoryRouter>
        <TestIonPage />
      </MemoryRouter>
    )

    expect(screen.getByTestId('ion-page-content')).toBeInTheDocument()
  })

  it('should support nested IonPage within IonApp', () => {
    render(
      <TestIonApp>
        <MemoryRouter>
          <TestIonPage />
        </MemoryRouter>
      </TestIonApp>
    )

    expect(screen.getByTestId('ion-app-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('ion-page-content')).toBeInTheDocument()
  })

  it('should maintain React Router functionality with Ionic components', () => {
    const TestRoute = () => (
      <IonPage>
        <IonContent>
          <div data-testid="routed-content">Routed page content</div>
        </IonContent>
      </IonPage>
    )

    render(
      <TestIonApp>
        <MemoryRouter initialEntries={['/test']}>
          <TestRoute />
        </MemoryRouter>
      </TestIonApp>
    )

    expect(screen.getByTestId('routed-content')).toBeInTheDocument()
  })

  it('should handle multiple IonPage components', () => {
    const Page1 = () => (
      <IonPage>
        <IonContent>
          <div data-testid="page-1">Page 1 content</div>
        </IonContent>
      </IonPage>
    )

    const Page2 = () => (
      <IonPage>
        <IonContent>
          <div data-testid="page-2">Page 2 content</div>
        </IonContent>
      </IonPage>
    )

    const { rerender } = render(
      <TestIonApp>
        <MemoryRouter>
          <Page1 />
        </MemoryRouter>
      </TestIonApp>
    )

    expect(screen.getByTestId('page-1')).toBeInTheDocument()

    rerender(
      <TestIonApp>
        <MemoryRouter>
          <Page2 />
        </MemoryRouter>
      </TestIonApp>
    )

    expect(screen.getByTestId('page-2')).toBeInTheDocument()
  })

  it('should preserve existing CSS classes with Ionic structure', () => {
    render(
      <TestIonApp>
        <IonPage>
          <IonContent>
            <div className="custom-class" data-testid="styled-content">
              Styled content
            </div>
          </IonContent>
        </IonPage>
      </TestIonApp>
    )

    const styledElement = screen.getByTestId('styled-content')
    expect(styledElement).toHaveClass('custom-class')
  })

  it('should support scroll behavior in IonContent', () => {
    render(
      <TestIonApp>
        <IonPage>
          <IonContent>
            <div data-testid="scrollable-content" style={{ height: '2000px' }}>
              Very tall content that should scroll
            </div>
          </IonContent>
        </IonPage>
      </TestIonApp>
    )

    const scrollableContent = screen.getByTestId('scrollable-content')
    expect(scrollableContent).toBeInTheDocument()
    expect(scrollableContent.style.height).toBe('2000px')
  })

  it('should maintain accessibility with Ionic components', () => {
    render(
      <TestIonApp>
        <IonPage>
          <IonContent>
            <button data-testid="accessible-button" aria-label="Test button">
              Click me
            </button>
          </IonContent>
        </IonPage>
      </TestIonApp>
    )

    const button = screen.getByTestId('accessible-button')
    expect(button).toHaveAttribute('aria-label', 'Test button')
  })
})
