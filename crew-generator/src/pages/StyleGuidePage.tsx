import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Input } from '../components/ui/input'
import { Textarea } from '../components/ui/textarea'
import { Checkbox } from '../components/ui/checkbox'
import { Label } from '../components/ui/label'
import { 
  FeatureCard, 
  PageHeader, 
  EmptyState, 
  LoadingSpinner, 
  StatusBadge,
  Stack,
  HStack
} from '../components/design-system'
import { Copy, Check, Heart, Star, User, Calendar, MessageCircle, Camera, Download } from 'lucide-react'
import { toast } from 'sonner'

export default function StyleGuidePage() {
  const [copiedToken, setCopiedToken] = useState<string | null>(null)

  const copyToClipboard = (text: string, tokenName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedToken(tokenName)
    toast.success(`Copied ${tokenName} to clipboard`)
    setTimeout(() => setCopiedToken(null), 2000)
  }

  const colorTokens = [
    { name: 'Primary', value: 'hsl(var(--primary))', css: 'bg-primary text-primary-foreground' },
    { name: 'Primary Foreground', value: 'hsl(var(--primary-foreground))', css: 'bg-primary-foreground text-primary' },
    { name: 'Secondary', value: 'hsl(var(--secondary))', css: 'bg-secondary text-secondary-foreground' },
    { name: 'Background', value: 'hsl(var(--background))', css: 'bg-background text-foreground' },
    { name: 'Foreground', value: 'hsl(var(--foreground))', css: 'bg-foreground text-background' },
    { name: 'Muted', value: 'hsl(var(--muted))', css: 'bg-muted text-muted-foreground' },
    { name: 'Muted Foreground', value: 'hsl(var(--muted-foreground))', css: 'bg-muted-foreground text-background' },
    { name: 'Card', value: 'hsl(var(--card))', css: 'bg-card text-card-foreground border' },
    { name: 'Border', value: 'hsl(var(--border))', css: 'border-4 border-border bg-background' },
    { name: 'Destructive', value: 'hsl(var(--destructive))', css: 'bg-destructive text-destructive-foreground' },
  ]

  const spacingTokens = [
    // Content Spacing
    { name: 'Content Padding Small', value: '16px', css: 'px-content-sm' },
    { name: 'Content Padding Medium', value: '24px', css: 'px-content-md' },
    { name: 'Content Padding Large', value: '32px', css: 'px-content-lg' },
    
    // Page Layout Spacing - NEW
    { name: 'Page Padding (All)', value: 'Responsive', css: 'page-padding' },
    { name: 'Page Padding X', value: 'Responsive', css: 'page-padding-x' },
    { name: 'Page Padding Y', value: 'Responsive', css: 'page-padding-y' },
    
    // Card Spacing
    { name: 'Card Padding Small', value: '16px', css: 'p-card-sm' },
    { name: 'Card Padding Medium', value: '24px', css: 'p-card-md' },
    { name: 'Card Padding Large', value: '32px', css: 'p-card-lg' },
    
    // Form Spacing
    { name: 'Form Container Padding', value: '24px', css: 'p-form' },
    { name: 'Form Field Spacing', value: '16px', css: 'space-y-form-field' },
    
    // Touch Targets
    { name: 'Touch Target', value: '44px', css: 'touch-target' },
    { name: 'Touch Target Large', value: '48px', css: 'touch-target-lg' },
    { name: 'Touch Target Small', value: '40px', css: 'touch-target-sm' },
    
    // System Utilities
    { name: 'Safe Area Padding', value: 'calc(1rem + env(safe-area-inset))', css: 'px-safe' },
    { name: 'Container Max Width', value: '1280px', css: 'max-w-7xl' },
  ]

  const typographyTokens = [
    { name: 'Heading 1', css: 'text-4xl sm:text-5xl lg:text-6xl font-bold', example: 'Main Page Title' },
    { name: 'Heading 2', css: 'text-2xl sm:text-3xl font-bold', example: 'Section Title' },
    { name: 'Heading 3', css: 'text-xl font-semibold', example: 'Card Title' },
    { name: 'Body Large', css: 'text-lg sm:text-xl', example: 'Hero subtitle text' },
    { name: 'Body', css: 'text-base', example: 'Regular body text' },
    { name: 'Body Small', css: 'text-sm', example: 'Helper text and captions' },
    { name: 'Label', css: 'text-sm font-medium', example: 'Form labels' },
  ]

  return (
    <div className="min-h-screen-dynamic px-safe py-safe safe-scroll-content">
      <PageHeader
        icon={<span className="text-3xl">🎨</span>}
        title="Design System Style Guide"
        subtitle="Complete reference for colors, typography, components, and patterns"
      />

      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Color Tokens */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">🎨 Color Tokens</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {colorTokens.map((token) => (
              <Card key={token.name} className="group hover:shadow-lg transition-all duration-200">
                <CardContent className="p-4">
                  <div className={`w-full h-16 rounded-lg mb-3 ${token.css} flex items-center justify-center text-sm font-medium`}>
                    {token.name}
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium text-sm">{token.name}</p>
                    <button
                      onClick={() => copyToClipboard(token.css, token.name)}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full text-left"
                    >
                      <code className="bg-muted px-2 py-1 rounded flex-1">{token.css}</code>
                      {copiedToken === token.name ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Typography */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">📝 Typography Scale</h2>
          <Card>
            <CardContent className="p-6 space-y-6">
              {typographyTokens.map((token) => (
                <div key={token.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">{token.name}</span>
                    <button
                      onClick={() => copyToClipboard(token.css, token.name)}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <code className="bg-muted px-2 py-1 rounded">{token.css}</code>
                      {copiedToken === token.name ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                  <p className={token.css}>{token.example}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </section>

        {/* Spacing & Layout */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">📐 Spacing & Layout</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {spacingTokens.map((token) => (
              <Card key={token.name}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <h3 className="font-semibold">{token.name}</h3>
                    <div className="bg-primary/10 border-2 border-dashed border-primary/30 rounded-lg p-4">
                      <div className={`bg-primary rounded ${token.css} flex items-center justify-center text-primary-foreground text-xs font-medium`}>
                        {token.value}
                      </div>
                    </div>
                    <button
                      onClick={() => copyToClipboard(token.css, token.name)}
                      className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-full"
                    >
                      <code className="bg-muted px-2 py-1 rounded flex-1">{token.css}</code>
                      {copiedToken === token.name ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Design System Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">🧩 Design System Components</h2>
          
          {/* Feature Cards */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Feature Cards</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FeatureCard
                  icon={<Heart className="h-6 w-6 text-red-500" />}
                  title="Default Variant"
                  description="Standard feature card with hover effects"
                  actionText="Learn More"
                  onClick={() => toast.info('Default card clicked')}
                />
                <FeatureCard
                  icon={<Star className="h-6 w-6 text-yellow-500" />}
                  title="Primary Variant"
                  description="Enhanced card with gradient background"
                  actionText="Get Started"
                  variant="primary"
                  onClick={() => toast.info('Primary card clicked')}
                />
                <FeatureCard
                  icon={<User className="h-6 w-6 text-blue-500" />}
                  title="Secondary Variant"
                  description="Subtle gradient with soft colors"
                  actionText="View Profile"
                  variant="secondary"
                  onClick={() => toast.info('Secondary card clicked')}
                />
              </div>
            </div>

            {/* Empty States */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Empty States</h3>
              <div className="max-w-md">
                <EmptyState
                  icon={<Calendar className="h-8 w-8 text-muted-foreground" />}
                  title="No events yet"
                  description="Create your first event to start building your concert crew"
                  badge="Coming soon"
                  action={
                    <Button onClick={() => toast.info('Create event clicked')}>
                      Create Event
                    </Button>
                  }
                />
              </div>
            </div>

            {/* Loading Spinners */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Loading Spinners</h3>
              <div className="flex items-center gap-8">
                <div className="text-center space-y-2">
                  <LoadingSpinner size="sm" />
                  <p className="text-xs text-muted-foreground">Small</p>
                </div>
                <div className="text-center space-y-2">
                  <LoadingSpinner size="md" />
                  <p className="text-xs text-muted-foreground">Medium</p>
                </div>
                <div className="text-center space-y-2">
                  <LoadingSpinner size="lg" />
                  <p className="text-xs text-muted-foreground">Large</p>
                </div>
                <div className="text-center space-y-2">
                  <LoadingSpinner variant="muted" />
                  <p className="text-xs text-muted-foreground">Muted</p>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Status Badges</h3>
              <div className="flex flex-wrap gap-3">
                <StatusBadge status="active">Active</StatusBadge>
                <StatusBadge status="inactive">Inactive</StatusBadge>
                <StatusBadge status="pending">Pending</StatusBadge>
                <StatusBadge status="full">Full</StatusBadge>
                <StatusBadge status="available">Available</StatusBadge>
              </div>
            </div>

            {/* Page Layout System */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Page Layout System</h3>
              <p className="text-muted-foreground mb-6">
                Enterprise-grade consistent spacing using PageLayout components and design tokens.
              </p>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>PageLayout Component Usage</CardTitle>
                  <CardDescription>
                    Provides consistent spacing across all pages with responsive design tokens
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm overflow-x-auto">
                    <pre className="whitespace-pre-wrap">
{`import { PageLayout, PageSection } from '../components/design-system/PageLayout'

// Standard page layout
<PageLayout>
  <h1>Page Title</h1>
  <PageSection>
    <p>Content with consistent spacing...</p>
  </PageSection>
</PageLayout>

// Custom layout options
<PageLayout 
  className="max-w-4xl"
  includePaddingY={false}
>
  <CustomContent />
</PageLayout>`}
                    </pre>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-medium mb-2">Key Features:</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• Responsive padding (16px → 24px → 32px)</li>
                        <li>• Safe area support for mobile</li>
                        <li>• Bottom navigation clearance</li>
                        <li>• Configurable max-width containers</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">CSS Classes:</h4>
                      <ul className="text-muted-foreground space-y-1">
                        <li>• <code className="bg-muted px-1 rounded">page-padding</code> - All sides</li>
                        <li>• <code className="bg-muted px-1 rounded">page-padding-x</code> - Horizontal only</li>
                        <li>• <code className="bg-muted px-1 rounded">page-padding-y</code> - Vertical only</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Stack Components - Professional Spacing System */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Stack Components - Professional Spacing</h3>
              <p className="text-muted-foreground mb-6">
                Industry-standard vertical and horizontal spacing components following Material Design and enterprise SaaS best practices.
              </p>
              
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle>Stack Component API</CardTitle>
                  <CardDescription>
                    Consistent spacing system using design tokens for professional layouts
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Vertical Stack Examples */}
                  <div>
                    <h4 className="font-medium mb-3">Vertical Stack (Default)</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Example */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">Example: Card List with 'lg' spacing (32px)</p>
                        <Stack spacing="lg" className="max-w-sm border-2 border-dashed border-primary/30 p-4 rounded-lg bg-primary/5">
                          <Card className="p-4 bg-primary/10 border-primary/20">
                            <h4 className="font-medium">Card 1</h4>
                            <p className="text-sm text-muted-foreground">32px spacing below</p>
                          </Card>
                          <Card className="p-4 bg-primary/10 border-primary/20">
                            <h4 className="font-medium">Card 2</h4>
                            <p className="text-sm text-muted-foreground">32px spacing below</p>
                          </Card>
                          <Card className="p-4 bg-primary/10 border-primary/20">
                            <h4 className="font-medium">Card 3</h4>
                            <p className="text-sm text-muted-foreground">Consistent vertical rhythm</p>
                          </Card>
                        </Stack>
                      </div>
                      
                      {/* Code */}
                      <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto">
                        <pre className="whitespace-pre-wrap">
{`<Stack spacing="md">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</Stack>`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Horizontal Stack Examples */}
                  <div>
                    <h4 className="font-medium mb-3">Horizontal Stack (HStack)</h4>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Example */}
                      <div>
                        <p className="text-sm text-muted-foreground mb-3">Example: Button Group</p>
                        <HStack spacing="sm">
                          <Button variant="outline">Cancel</Button>
                          <Button>Save</Button>
                          <Button variant="outline">Preview</Button>
                        </HStack>
                      </div>
                      
                      {/* Code */}
                      <div className="bg-muted p-4 rounded-lg font-mono text-xs overflow-x-auto">
                        <pre className="whitespace-pre-wrap">
{`<HStack spacing="sm">
  <Button variant="outline">Cancel</Button>
  <Button>Save</Button>
  <Button variant="outline">Preview</Button>
</HStack>`}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {/* Spacing Scale */}
                  <div>
                    <h4 className="font-medium mb-3">Spacing Scale</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      {[
                        { size: 'xs', px: '8px', token: '--space-2', use: 'Tight spacing' },
                        { size: 'sm', px: '16px', token: '--space-4', use: 'List items' },
                        { size: 'md', px: '24px', token: '--space-6', use: 'Components (default)' },
                        { size: 'lg', px: '32px', token: '--space-8', use: 'Sections' },
                        { size: 'xl', px: '48px', token: '--space-12', use: 'Major sections' },
                        { size: '2xl', px: '64px', token: '--space-16', use: 'Page sections' }
                      ].map(({ size, px, token, use }) => (
                        <div key={size} className="p-3 border rounded-lg">
                          <div className="font-mono text-xs text-primary">{size}</div>
                          <div className="font-medium">{px}</div>
                          <div className="text-xs text-muted-foreground">{token}</div>
                          <div className="text-xs text-muted-foreground mt-1">{use}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Usage Guidelines */}
                  <div>
                    <h4 className="font-medium mb-3">Usage Guidelines</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <h5 className="font-medium text-green-600 mb-2">✅ Do</h5>
                        <ul className="text-muted-foreground space-y-1">
                          <li>• Use Stack for consistent vertical spacing</li>
                          <li>• Choose spacing based on content hierarchy</li>
                          <li>• Use 'md' (24px) for most component spacing</li>
                          <li>• Use 'lg' or 'xl' for major page sections</li>
                          <li>• Combine with semantic HTML elements</li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="font-medium text-red-600 mb-2">❌ Don't</h5>
                        <ul className="text-muted-foreground space-y-1">
                          <li>• Mix Stack with manual margin classes</li>
                          <li>• Use arbitrary spacing values</li>
                          <li>• Nest Stacks unnecessarily</li>
                          <li>• Override spacing with !important</li>
                          <li>• Use for single-child containers</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Page Header Examples */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Page Header Examples</h3>
              <div className="space-y-6">
                {/* Chat Overview Layout Example */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      Chat Overview Layout
                    </CardTitle>
                    <CardDescription>
                      Layout pattern used in ChatOverviewPage with safe scroll content
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-muted-foreground/30">
                      <PageHeader
                        title="Your Chats"
                        subtitle="3 active chats"
                        icon={<MessageCircle className="h-8 w-8 text-primary" />}
                      />
                      <div className="mt-4 space-y-3">
                        <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-lg">Artist Chat</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                  <Calendar className="h-4 w-4" />
                                  Taylor Swift • Austin
                                </CardDescription>
                              </div>
                              <Badge variant="secondary" className="text-xs">5</Badge>
                            </div>
                          </CardHeader>
                        </Card>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><code>safe-scroll-content</code> - Handles bottom nav spacing</p>
                      <p><code>touch-target</code> - 44px minimum touch areas</p>
                      <p><code>truncate</code> - Prevents text overflow</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Photos Overview Layout Example */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Camera className="h-5 w-5" />
                      Photos Overview Layout
                    </CardTitle>
                    <CardDescription>
                      Layout pattern used in PhotosOverviewPage with image grids
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-muted/30 rounded-lg p-4 border-2 border-dashed border-muted-foreground/30">
                      <PageHeader
                        title="Your Photos"
                        subtitle="12 photos uploaded"
                        icon={<Camera className="h-8 w-8 text-primary" />}
                      />
                      <div className="mt-4 space-y-4">
                        <Button className="w-full touch-target">
                          <Download className="h-4 w-4 mr-2" />
                          Download All 12 Photos
                        </Button>
                        <Card className="overflow-hidden">
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg">Concert Photo</CardTitle>
                            <CardDescription>Austin • Dec 2024</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="bg-muted h-32 rounded-lg flex items-center justify-center">
                              <Camera className="h-8 w-8 text-muted-foreground" />
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p><code>overflow-hidden</code> - Clean card image containers</p>
                      <p><code>object-cover</code> - Responsive image scaling</p>
                      <p><code>group-hover:</code> - Interactive image previews</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Core UI Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">⚡ Core UI Components</h2>
          
          {/* Buttons */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Buttons - Simplified System ✨</h3>
              
              {/* New Simplified System */}
              <div className="space-y-6">
                <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
                  <h4 className="text-md font-medium mb-3 text-foreground">🎯 Our 3-Button System</h4>
                  <p className="text-sm text-muted-foreground mb-4">All buttons are touch-friendly (44px+), auto-width by default, purple brand, rounded corners!</p>
                  
                  {/* Auto-width Preview */}
                  <div className="max-w-sm mx-auto space-y-3 mb-4">
                    <p className="text-xs text-muted-foreground text-center">🎯 Auto-width (Default)</p>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button>Primary Action</Button>
                      <Button variant="outline">Secondary Action</Button>
                      <Button variant="destructive">Destructive Action</Button>
                    </div>
                  </div>
                  
                  {/* Full-width Preview */}
                  <div className="max-w-sm mx-auto space-y-3 mb-4">
                    <p className="text-xs text-muted-foreground text-center">📱 Full-width (Forms)</p>
                    <Button fullWidth={true}>Sign In / Sign Up</Button>
                    <Button variant="outline" fullWidth={true}>Cancel</Button>
                  </div>
                  
                  {/* Desktop Preview */}
                  <div className="hidden sm:block">
                    <p className="text-xs text-muted-foreground mb-2">💻 Desktop Preview (auto-width)</p>
                    <div className="flex flex-wrap gap-3">
                      <Button>Primary Action</Button>
                      <Button variant="outline">Secondary Action</Button>
                      <Button variant="destructive">Destructive Action</Button>
                    </div>
                  </div>
                </div>

                {/* Usage Examples */}
                <div>
                  <h4 className="text-md font-medium mb-3 text-muted-foreground">✅ Usage Examples</h4>
                  <Stack spacing="sm">
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Primary Actions (90% of buttons)</p>
                      <div className="max-w-sm space-y-2">
                        <Button>Join Pod</Button>
                        <Button>Create Event</Button>
                        <Button>Save Changes</Button>
                        <Button>Sign In</Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Secondary Actions (Cancel, Back)</p>
                      <div className="max-w-sm space-y-2">
                        <Button variant="outline">Cancel</Button>
                        <Button variant="outline">← Back to Events</Button>
                        <Button variant="outline">Leave Pod</Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Destructive Actions (rare)</p>
                      <div className="max-w-sm space-y-2">
                        <Button variant="destructive">Delete Event</Button>
                        <Button variant="destructive">Remove Member</Button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Button States</p>
                      <div className="max-w-sm space-y-2">
                        <Button>Normal</Button>
                        <Button disabled>Disabled</Button>
                      </div>
                    </div>
                  </Stack>
                </div>
              </div>
            </div>

            {/* Form Controls */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Form Controls</h3>
              <Card className="max-w-md">
                <CardContent className="p-6 space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="demo-input">Email Address</Label>
                    <Input id="demo-input" type="email" placeholder="Enter your email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="demo-textarea">Message</Label>
                    <Textarea id="demo-textarea" placeholder="Type your message here" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="demo-checkbox" />
                    <Label htmlFor="demo-checkbox">Subscribe to newsletter</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Badges */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Badges</h3>
              <div className="flex flex-wrap gap-3">
                <Badge>Default</Badge>
                <Badge variant="secondary">Secondary</Badge>
                <Badge variant="outline">Outline</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Guidelines */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">📋 Usage Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">✅ Do</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Use PageLayout component for all pages</p>
                <p>• Use design tokens for consistent styling</p>
                <p>• Follow touch target minimums (44px)</p>
                <p>• Apply safe area padding on mobile</p>
                <p>• Use semantic color names (primary, destructive)</p>
                <p>• Test in both light and dark modes</p>
                <p>• Include proper ARIA labels</p>
                <p>• Use <code>safe-scroll-content</code> for bottom nav spacing</p>
                <p>• Apply <code>touch-target-sm</code> for compact buttons</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">❌ Don't</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p>• Use hardcoded colors or spacing</p>
                <p>• Create touch targets smaller than 44px</p>
                <p>• Ignore safe area insets on mobile</p>
                <p>• Use generic class names like 'purple-600'</p>
                <p>• Test only in one theme mode</p>
                <p>• Forget accessibility attributes</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Development Testing Section */}
        {import.meta.env.DEV && (
          <section className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-4">🧪 Development Testing</h2>
              <div className="space-y-4">
                <Button
                  onClick={() => {
                    throw new Error('This is a test crash - Error boundary should catch this!')
                  }}
                  variant="destructive"
                  className="mr-4"
                >
                  💥 Test Error Boundary
                </Button>
                <Button
                  onClick={() => {
                    console.log('🔧 Testing devLog:', { timestamp: new Date(), test: 'data' })
                    console.error('❌ Testing devError:', new Error('Test error'))
                    console.log('✅ Testing devSuccess:', 'Test completed')
                  }}
                  variant="outline"
                >
                  🔍 Test Dev Logging
                </Button>
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
