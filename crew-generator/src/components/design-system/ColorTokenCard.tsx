import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Copy, Check } from 'lucide-react'

interface ColorTokenCardProps {
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
 * ColorTokenCard - Reusable Color Token Card Component
 * 
 * Built on the base Card component with consistent styling.
 * Used in StyleGuidePage for displaying color tokens.
 * 
 * @example
 * <ColorTokenCard 
 *   token={colorToken} 
 *   isCopied={copiedToken === token.name}
 *   onCopy={copyToClipboard}
 * />
 */
export function ColorTokenCard({ token, isCopied, onCopy }: ColorTokenCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <CardContent>
        <div className={`w-full h-16 rounded-lg mb-[var(--space-3)] ${token.css} flex items-center justify-center text-[var(--text-sm)] font-medium`}>
          {token.name}
        </div>
        <div className="space-y-[var(--space-2)]">
          <p className="font-medium text-[var(--text-sm)]">{token.name}</p>
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



