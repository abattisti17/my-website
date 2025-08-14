import React from 'react';
import BackButton from '../components/BackButton';
import PullQuote from '../components/PullQuote';
import Button from '../components/Button';
import Icon from '../components/Icon';
import { Spinner, Skeleton } from '../components/Loading';

const StyleGuide: React.FC = () => {
  const colorTokens = [
    { name: '--color-primary', value: '#E8C547', usage: 'Yellow highlight, buttons, accents' },
    { name: '--color-primary-hover', value: '#E8C547', usage: 'Hover states for primary elements' },
    { name: '--color-secondary', value: '#161A45', usage: 'Deep blue accent' },
    { name: '--color-background', value: '#FFFEF9', usage: 'Page background' },
    { name: '--color-surface', value: '#FBF8ED', usage: 'Quote blocks, cards' },
    { name: '--color-border', value: '#161A45', usage: 'Container borders, dividers' },
    { name: '--color-text-primary', value: '#161A45', usage: 'Headings, page titles' },
    { name: '--color-text-secondary', value: '#383A53', usage: 'Body text, paragraphs' },
    { name: '--color-text-muted', value: '#545666', usage: 'Subtitles, meta text' },
    { name: '--color-link', value: '#161A45', usage: 'Link default state' },
    { name: '--color-link-hover', value: '#FBF8ED', usage: 'Link hover background' },
    { name: '--color-link-active', value: '#E8C547', usage: 'Link active state' },
  ];

  const typographyTokens = [
    { name: '--text-sm', value: '16px', usage: 'Small UI text, attribution (consolidated)' },
    { name: '--text-footer', value: '14px', usage: 'Footer content, fine print' },
    { name: '--text-base', value: '20px', usage: 'Body text, paragraphs' },
    { name: '--text-lg', value: '24px', usage: 'Large body text, subheadings' },
    { name: '--text-xl', value: '30px', usage: 'Section headings' },
    { name: '--text-2xl', value: '36px', usage: 'Page titles, large headings (consolidated)' },
    { name: '--text-4xl', value: '48px', usage: 'Hero text, display headings' },
  ];

  const spacingTokens = [
    { name: '--space-1', value: '2px', usage: 'Fine borders, hairlines' },
    { name: '--space-2', value: '4px', usage: 'Small gaps, tight spacing' },
    { name: '--space-3', value: '8px', usage: 'Icon padding, small margins' },
    { name: '--space-4', value: '16px', usage: 'Button padding, small gaps' },
    { name: '--space-5', value: '20px', usage: 'Medium component spacing' },
    { name: '--space-6', value: '24px', usage: 'Section spacing (mobile)' },
    { name: '--space-7', value: '32px', usage: 'Container padding (mobile)' },
    { name: '--space-8', value: '40px', usage: 'Large section spacing' },
    { name: '--space-9', value: '48px', usage: 'Page spacing' },
    { name: '--space-10', value: '60px', usage: 'Container padding (desktop)' },
    { name: '--space-12', value: '80px', usage: 'Major section breaks' },
  ];

  const ColorSwatch: React.FC<{ token: any }> = ({ token }) => (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
      <div 
        style={{ 
          width: '60px', 
          height: '40px', 
          backgroundColor: token.value,
          border: '1px solid #ccc',
          marginRight: '16px',
          borderRadius: '4px'
        }}
      ></div>
      <div>
        <code style={{ fontWeight: 'bold', fontSize: '14px' }}>{token.name}</code>
        <br />
        <span style={{ color: '#666', fontSize: '12px' }}>{token.value}</span>
        <br />
        <span style={{ fontSize: '14px' }}>{token.usage}</span>
      </div>
    </div>
  );

  return (
    <>
      <BackButton />
      <div className="page-container">
        <div className="page-content">
          <div className="page-header">
            <h1 className="page-title">Style Guide</h1>
            <p>Complete visual design system documentation including colors, typography, spacing, and components used across the website.</p>
          </div>

          {/* COLORS SECTION */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-xl)', 
              marginBottom: 'var(--space-6)',
              color: 'var(--color-text-primary)'
            }}>
              Color Palette
            </h2>
            <p style={{ marginBottom: 'var(--space-6)' }}>
              All color tokens used throughout the design system:
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {colorTokens.map((token, index) => (
                <ColorSwatch key={index} token={token} />
              ))}
            </div>
          </section>

          {/* TYPOGRAPHY SECTION */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-xl)', 
              marginBottom: 'var(--space-6)',
              color: 'var(--color-text-primary)'
            }}>
              Typography Scale
            </h2>
            <p style={{ marginBottom: 'var(--space-6)' }}>
              Font sizes used throughout the website:
            </p>
            
            {typographyTokens.map((token, index) => (
              <div key={index} style={{ marginBottom: '24px', padding: '16px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
                <div style={{ fontSize: token.value, fontFamily: 'var(--font-serif)', marginBottom: '8px' }}>
                  Sample Text ({token.value})
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                  <code>{token.name}</code> - {token.usage}
                </div>
              </div>
            ))}

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginTop: 'var(--space-8)',
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Font Families
            </h3>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: 'var(--font-serif)', fontSize: 'var(--text-lg)', marginBottom: '8px' }}>
                IBM Plex Serif - Used for headings and titles
              </div>
              <code style={{ fontSize: '14px', color: '#666' }}>--font-serif</code>
            </div>
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-base)', marginBottom: '8px' }}>
                IBM Plex Sans - Used for body text and UI elements
              </div>
              <code style={{ fontSize: '14px', color: '#666' }}>--font-sans</code>
            </div>
          </section>

          {/* SPACING SECTION */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-xl)', 
              marginBottom: 'var(--space-6)',
              color: 'var(--color-text-primary)'
            }}>
              Spacing Scale
            </h2>
            <p style={{ marginBottom: 'var(--space-6)' }}>
              Consistent spacing tokens used for margins, padding, and layout:
            </p>
            
            {spacingTokens.map((token, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <div 
                  style={{ 
                    width: token.value,
                    height: '20px',
                    backgroundColor: 'var(--color-primary)',
                    marginRight: '20px',
                    minWidth: '2px'
                  }}
                ></div>
                <div>
                  <code style={{ fontWeight: 'bold', fontSize: '14px' }}>{token.name}</code>
                  <span style={{ margin: '0 12px', color: '#666' }}>({token.value})</span>
                  <span style={{ fontSize: '14px' }}>{token.usage}</span>
                </div>
              </div>
            ))}
          </section>

          {/* COMPONENTS SECTION */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-xl)', 
              marginBottom: 'var(--space-6)',
              color: 'var(--color-text-primary)'
            }}>
              Components
            </h2>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Back Button Component
            </h3>
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <div style={{ 
                border: '2px dashed #ccc', 
                borderRadius: '4px', 
                padding: '16px',
                backgroundColor: '#fff',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center'
              }}>
                <img src="/back-button.svg" alt="Back" style={{ width: '30px', height: '30px', marginRight: '8px' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)', color: 'var(--color-text-primary)' }}>
                  Back
                </span>
                <span style={{ marginLeft: '12px', fontSize: '12px', color: '#666', fontStyle: 'italic' }}>
                  (Static representation - actual component is positioned fixed/sticky)
                </span>
              </div>
              <code style={{ fontSize: '12px', color: '#666' }}>
                BackButton component - Used on: All subpages (About, Work, Consulting, Projects, Style Guide)
                <br />Features: SVG icon, hover animation, navigation history
                <br />Positioning: Fixed (desktop) / Sticky (mobile)
              </code>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Navigation Links
            </h3>
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <div style={{ marginBottom: '16px' }}>
                <div className="nav-link" style={{ display: 'inline-block', marginBottom: '8px' }}>
                  Home Navigation Example
                </div>
                <br />
                <code style={{ fontSize: '12px', color: '#666' }}>
                  .nav-link - Large serif links with animated yellow background on hover
                </code>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <div className="project-link" style={{ display: 'inline-block' }}>
                  Project Link Example
                </div>
                <br />
                <code style={{ fontSize: '12px', color: '#666' }}>
                  .project-link - Smaller sans-serif links with same hover animation
                </code>
              </div>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Custom Cursors
            </h3>
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <div style={{ marginBottom: '16px' }}>
                <button className="custom-cursor-work" style={{ 
                  background: 'none', 
                  border: '2px solid #ccc', 
                  padding: '12px 20px',
                  margin: '8px',
                  borderRadius: '4px'
                }}>
                  Work Cursor (Triangle)
                </button>
                <button className="custom-cursor-about" style={{ 
                  background: 'none', 
                  border: '2px solid #ccc', 
                  padding: '12px 20px',
                  margin: '8px',
                  borderRadius: '4px'
                }}>
                  About Cursor (Ellipse)
                </button>
                <button className="custom-cursor-consulting" style={{ 
                  background: 'none', 
                  border: '2px solid #ccc', 
                  padding: '12px 20px',
                  margin: '8px',
                  borderRadius: '4px'
                }}>
                  Consulting Cursor (Hexagon)
                </button>
              </div>
              <code style={{ fontSize: '12px', color: '#666' }}>
                Custom SVG cursors for navigation - Each section has a unique cursor shape
                <br />Default: Circle with dot | Active: Circle with dashed ring | Navigation-specific: Triangle, Ellipse, Hexagon
              </code>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Hover & Active States
            </h3>
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ marginBottom: '8px' }}><strong>Link Hover Animation:</strong></p>
                <Button 
                  variant="nav"
                  className="nav-link-demo"
                  style={{ 
                    display: 'inline-block',
                    marginBottom: '8px',
                    fontSize: 'var(--text-lg)',
                    textDecoration: 'none'
                  }}
                >
                  Hover me to see the yellow background expand!
                </Button>
                <br />
                <Button 
                  variant="project"
                  className="project-link-demo"
                  style={{ 
                    display: 'inline-block',
                    fontSize: 'var(--text-base)',
                    textDecoration: 'none'
                  }}
                >
                  Project link hover example
                </Button>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ marginBottom: '8px' }}><strong>Back Button Hover:</strong></p>
                <button 
                  className="back-button-link" 
                  style={{ 
                    display: 'inline-flex',
                    alignItems: 'center',
                    border: '2px dashed #ccc',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    backgroundColor: 'transparent',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => e.preventDefault()}
                >
                  <img src="/back-button.svg" alt="Back" style={{ width: '24px', height: '24px', marginRight: '6px' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: 'var(--text-sm)' }}>
                    Hover me to see the slide effect!
                  </span>
                </button>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ marginBottom: '8px' }}><strong>Text Selection:</strong></p>
                <span style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-text-on-primary)' }}>
                  Selected text has yellow background
                </span>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ marginBottom: '8px' }}><strong>NEW - Active/Click States:</strong></p>
                <div style={{ padding: '12px', backgroundColor: '#f0f0f0', borderRadius: '4px', fontSize: '14px' }}>
                  <strong>🎯 Click or tap any link to see the new active state!</strong>
                  <br />
                  <span style={{ color: '#666' }}>
                    • Background: Dark blue (#161A45)
                    <br />
                    • Text: Yellow (#E8C547) 
                    <br />
                    • Duration: 250ms animation for clear feedback
                    <br />
                    • Works on: All links, nav links, project links, back button
                  </span>
                </div>
              </div>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Icons & Assets
            </h3>
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <div style={{ marginBottom: '16px' }}>
                <img src="/back-button.svg" alt="Back button icon" style={{ width: '30px', height: '30px', marginRight: '12px' }} />
                <code style={{ fontSize: '12px', color: '#666' }}>
                  /back-button.svg - 30x30px SVG icon used in BackButton component
                </code>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  SVG-based custom cursors: Inline data URIs with yellow fill and black stroke
                </code>
              </div>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Button Component (NEW)
            </h3>
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <Button variant="primary">Primary Button</Button>
                <Button variant="secondary">Secondary Button</Button>
                <Button variant="link">Link Button</Button>
                <Button variant="primary" size="small">Small</Button>
                <Button variant="primary" size="large">Large</Button>
              </div>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
                <Button variant="primary" disabled>Disabled</Button>
                <Button variant="primary" loading>Loading</Button>
                <Button variant="nav" cursorClass="custom-cursor-work">Nav with Cursor</Button>
              </div>
              <code style={{ fontSize: '12px', color: '#666' }}>
                Button component - Supports variants: primary, secondary, link, nav, project
                <br />Sizes: small, medium, large | States: disabled, loading | Custom cursors supported
              </code>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Icon Component (NEW)
            </h3>
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="back" size="small" />
                  <code>back (small)</code>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="arrow-left" />
                  <code>arrow-left</code>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="arrow-right" />
                  <code>arrow-right</code>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="external-link" color="var(--color-primary)" />
                  <code>external-link</code>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="close" size="large" />
                  <code>close (large)</code>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Icon name="menu" />
                  <code>menu</code>
                </div>
              </div>
              <code style={{ fontSize: '12px', color: '#666' }}>
                Icon component - Centralized SVG icons with consistent sizing
                <br />Sizes: small (16px), medium (24px), large (32px) | Custom colors supported
              </code>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Loading Components (NEW)
            </h3>
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ marginBottom: '8px' }}><strong>Spinners:</strong></p>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '12px' }}>
                  <Spinner size="small" />
                  <Spinner size="medium" />
                  <Spinner size="large" />
                  <span style={{ fontSize: '12px', color: '#666' }}>Small, Medium, Large</span>
                </div>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <p style={{ marginBottom: '8px' }}><strong>Skeletons:</strong></p>
                <div style={{ marginBottom: '8px' }}>
                  <Skeleton variant="text" width="60%" />
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <Skeleton variant="text" lines={3} />
                </div>
                <div style={{ marginBottom: '8px' }}>
                  <Skeleton variant="rectangular" width="100%" height="60px" />
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <Skeleton variant="circular" width="40px" />
                  <Skeleton variant="text" width="120px" />
                </div>
              </div>
              <code style={{ fontSize: '12px', color: '#666' }}>
                Loading components - Spinner, Skeleton, LoadingPage, PageSkeleton
                <br />Supports text, rectangular, circular, and image skeleton variants
              </code>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Page Titles
            </h3>
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <h1 className="page-title">Example Page Title</h1>
              <code style={{ fontSize: '12px', color: '#666' }}>
                .page-title - Used on: All main pages (About, Work, Consulting, Projects)
              </code>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Links
            </h3>
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <button className="link-text" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>Example Link Text</button>
              <br /><br />
              <code style={{ fontSize: '12px', color: '#666' }}>
                .link-text - Used on: Home page navigation, project links, footer links
              </code>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Pull Quote Component
            </h3>
            <div style={{ marginBottom: '40px' }}>
              <PullQuote
                header="Component Example"
                quote="This is how pull quotes appear throughout the site"
                body="This component is used for testimonials, callouts, and highlighted content. It includes structured props for header, quote, body, and attribution."
                attribution="Style Guide Documentation"
              />
              <code style={{ fontSize: '12px', color: '#666', marginTop: '16px', display: 'block' }}>
                PullQuote component - Used on: Consulting page (testimonials), Work page (confidentiality note)
              </code>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Images
            </h3>
            <div style={{ marginBottom: '40px' }}>
              <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '100%', 
                  height: '200px', 
                  backgroundColor: '#ddd', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  marginBottom: '12px'
                }}>
                  Page Image Example (300px height)
                </div>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  .page-image - Used on: About page, Project detail pages
                </code>
              </div>
              
              <div style={{ padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px', marginBottom: '16px' }}>
                <div style={{ 
                  width: '100%', 
                  height: '150px', 
                  backgroundColor: '#ddd', 
                  borderRadius: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#666',
                  marginBottom: '12px'
                }}>
                  Page Image Hero Example (21:10 aspect ratio)
                </div>
                <code style={{ fontSize: '12px', color: '#666' }}>
                  .page-image-hero - Used on: Work page header
                </code>
              </div>
            </div>

            <h3 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-lg)', 
              marginBottom: 'var(--space-4)',
              color: 'var(--color-text-primary)'
            }}>
              Page Layout
            </h3>
            <div style={{ marginBottom: '40px', padding: '20px', backgroundColor: '#f9f9f9', borderRadius: '4px' }}>
              <div style={{ marginBottom: '16px' }}>
                <strong>.page-container</strong> - Outer container with responsive padding
                <br />
                <code style={{ fontSize: '11px', color: '#666' }}>
                  Desktop: 5% padding | Mobile: 20px padding
                </code>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>.page-content</strong> - Inner content container with border and background
                <br />
                <code style={{ fontSize: '11px', color: '#666' }}>
                  Max-width: 800px | Border: 3px solid black | Desktop padding: 60px | Mobile padding: 40px 32px
                </code>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>.page-header</strong> - Page title and description section
                <br />
                <code style={{ fontSize: '11px', color: '#666' }}>
                  Margin: 40px top and bottom
                </code>
              </div>
            </div>
          </section>

          {/* CSS CLASSES AUDIT */}
          <section style={{ marginBottom: '60px' }}>
            <h2 style={{ 
              fontFamily: 'var(--font-serif)', 
              fontSize: 'var(--text-xl)', 
              marginBottom: 'var(--space-6)',
              color: 'var(--color-text-primary)'
            }}>
              CSS Classes Audit
            </h2>
            <p style={{ marginBottom: 'var(--space-6)' }}>
              Complete list of custom CSS classes currently in use:
            </p>
            
            <div style={{ fontFamily: 'monospace', fontSize: '14px', lineHeight: '1.6' }}>
              <div style={{ marginBottom: '20px' }}>
                <strong>Layout Classes:</strong>
                <br />
                <code>.page-container</code> - Main page wrapper
                <br />
                <code>.page-content</code> - Content container with border
                <br />
                <code>.page-header</code> - Page title section
                <br />
                <code>.floating-back-link</code> - Floating back button
              </div>

              <div style={{ marginBottom: '20px' }}>
                <strong>Typography Classes:</strong>
                <br />
                <code>.page-title</code> - Main page headings
                <br />
                <code>.link-text</code> - Styled links
                <br />
                <code>.quote-title</code> - Large quote text
                <br />
                <code>.quote-body</code> - Quote body text
                <br />
                <code>.quote-attribution</code> - Quote attribution
              </div>

              <div style={{ marginBottom: '20px' }}>
                <strong>Image Classes:</strong>
                <br />
                <code>.page-image</code> - Standard page images
                <br />
                <code>.page-image-hero</code> - Hero banner images
                <br />
                <code>.page-image-fill</code> - Full-width images
                <br />
                <code>.content-image-adaptive</code> - Adaptive content images
                <br />
                <code>.responsive-image</code> - Base responsive image class
              </div>

              <div style={{ marginBottom: '20px' }}>
                <strong>Interactive Classes:</strong>
                <br />
                <code>.nav-link</code> - Large serif navigation links
                <br />
                <code>.project-link</code> - Project page links
                <br />
                <code>.back-button-link</code> - Back button styling
                <br />
                <code>.back-button-icon</code> - Back button SVG icon
                <br />
                <code>.back-button-text</code> - Back button text
                <br />
                <code>.floating-back-link</code> - Back button container
              </div>

              <div style={{ marginBottom: '20px' }}>
                <strong>Cursor Classes:</strong>
                <br />
                <code>.custom-cursor-work</code> - Triangle cursor for work section
                <br />
                <code>.custom-cursor-about</code> - Ellipse cursor for about section
                <br />
                <code>.custom-cursor-consulting</code> - Hexagon cursor for consulting
              </div>

              <div style={{ marginBottom: '20px' }}>
                <strong>Component Classes:</strong>
                <br />
                <code>.quote</code> - Quote/callout blocks
                <br />
                <code>.project-links</code> - Project navigation links
                <br />
                <code>.home-container</code> - Home page layout
                <br />
                <code>.home-header</code> - Home page header
                <br />
                <code>.home-footer</code> - Home page footer
                <br />
                <code>.nav-links</code> - Navigation links container
              </div>

              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#f2fff2', border: '1px solid #ccffcc', borderRadius: '4px' }}>
                <strong style={{ color: '#2e7d32' }}>✅ Components & Typography Optimized!</strong>
                <br /><br />
                <div style={{ color: '#1b5e20', fontSize: '14px', lineHeight: '1.6' }}>
                  ✅ Button component - Fully implemented with variants, sizes, states
                  <br />
                  ✅ Icon component - Centralized SVG management with consistent sizing
                  <br />
                  ✅ Loading components - Spinner, Skeleton, LoadingPage, PageSkeleton
                  <br />
                  ✅ Typography system - Consolidated from 9 to 7 font sizes
                  <br />
                  ✅ ResponsiveImage component - Fully implemented across all pages
                </div>
              </div>

              <div style={{ marginBottom: '20px', padding: '16px', backgroundColor: '#fff9e6', border: '1px solid #ffe066', borderRadius: '4px' }}>
                <strong style={{ color: '#b8860b' }}>💡 Opportunities for Enhancement:</strong>
                <br /><br />
                <div style={{ color: '#806600', fontSize: '14px', lineHeight: '1.6' }}>
                  • Replace hardcoded links with Button component throughout site
                  <br />
                  • Update BackButton to use Icon component
                  <br />
                  • Add loading states to page transitions
                  <br />
                  • Implement form validation components
                  <br />
                  • Create Card/Modal components for future features
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default StyleGuide;
