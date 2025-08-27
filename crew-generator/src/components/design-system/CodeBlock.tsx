import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CodeBlockProps {
  children: string
  language?: string
  className?: string
}

/**
 * CodeBlock - Design System Code Display Component
 * 
 * Built on top of the base Card component with IBM Plex Mono font.
 * Uses design tokens for consistent styling and spacing.
 * 
 * @example
 * <CodeBlock language="tsx">
 *   {`<Card>
 *   <CardHeader>
 *     <CardTitle>Title</CardTitle>
 *   </CardHeader>
 * </Card>`}
 * </CodeBlock>
 */
export function CodeBlock({ children, language: _language, className }: CodeBlockProps) {
  return (
    <Card className={cn("bg-muted/50", className)}>
      <CardContent>
        <pre className="overflow-x-auto text-sm" style={{ fontFamily: 'var(--font-code)' }}>
          <code className="block text-muted-foreground" style={{ fontFamily: 'var(--font-code)' }}>
            {children}
          </code>
        </pre>
      </CardContent>
    </Card>
  )
}
