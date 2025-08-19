import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
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
  StatusBadge 
} from '../components/design-system'
import { Copy, Check, Heart, Star, User, Calendar, MapPin } from 'lucide-react'
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
          </div>
        </section>

        {/* Core UI Components */}
        <section>
          <h2 className="text-2xl font-bold text-foreground mb-6">⚡ Core UI Components</h2>
          
          {/* Buttons */}
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Buttons</h3>
              <div className="flex flex-wrap gap-3">
                <Button>Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
                <Button size="sm">Small</Button>
                <Button size="lg">Large</Button>
                <Button disabled>Disabled</Button>
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
                <p>• Use design tokens for consistent styling</p>
                <p>• Follow touch target minimums (44px)</p>
                <p>• Apply safe area padding on mobile</p>
                <p>• Use semantic color names (primary, destructive)</p>
                <p>• Test in both light and dark modes</p>
                <p>• Include proper ARIA labels</p>
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

      </div>
    </div>
  )
}
