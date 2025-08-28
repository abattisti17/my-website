import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from 'lucide-react'

interface SpacingTokenCardProps {
  token: {
    name: string
    value: string
    css: string
  }
  /** Whether this token is currently copied */
  isCopied: boolean
  /** Function to handle copy action */
  onCopy: (css: string, name: string) => void
}

/**
 * SpacingTokenCard - Reusable Spacing Token Card Component
 * 
 * Built on the base Card component with consistent styling.
 * Used in StyleGuidePage for displaying spacing tokens.
 * 
 * @example
 * <SpacingTokenCard 
 *   token={spacingToken} 
 *   isCopied={copiedToken === token.name}
 *   onCopy={copyToClipboard}
 * />
 */
export function SpacingTokenCard({ token, isCopied, onCopy }: SpacingTokenCardProps) {
  return (
    <Card>
      <CardContent>
        <div className="space-y-[var(--space-3)]">
          <h3 className="font-semibold">{token.name}</h3>
          <div className="bg-primary/10 border-2 border-dashed border-primary/30 rounded-lg p-[var(--space-4)]">
            <div className={`bg-primary rounded ${token.css} flex items-center justify-center text-primary-foreground text-[var(--text-xs)] font-medium`}>
              {token.value}
            </div>
          </div>
          <Button
            variant="ghost"
            onClick={() => onCopy(token.css, token.name)}
            className="flex items-center gap-[var(--space-2)] text-[var(--text-xs)] text-muted-foreground hover:text-foreground transition-colors w-full justify-start h-auto p-0"
          >
            <code className="bg-muted px-[var(--space-2)] py-1 rounded flex-1 text-left">{token.css}</code>
            {isCopied ? (
              <Check className="h-3 w-3 text-green-600" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}





