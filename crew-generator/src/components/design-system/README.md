# Design System Architecture

## 🏗️ **Architecture Philosophy**

This design system uses a **hybrid approach** that combines the best of CSS-in-JS and Tailwind CSS for maximum reliability and maintainability.

### **Spacing Components** (Stack, HStack)
- ✅ **Use CSS Flexbox `gap` + Design Tokens**
- ❌ **Avoid Tailwind spacing utilities** (`space-y-*`, `gap-*`)

### **Styling Components** (Colors, Layout, Borders)
- ✅ **Use Tailwind utilities** (`bg-primary`, `rounded-lg`, `flex`)
- ✅ **Combine with spacing components** for best results

## 🎯 **Why This Approach?**

### **Problem Solved**
- **Tailwind v4 Compatibility**: `space-y-*` utilities don't work reliably in Tailwind v4
- **Framework Independence**: Works regardless of CSS framework changes
- **Performance**: No CSS bloat from unused utility generation

### **Industry Standard**
This is the same approach used by:
- **GitHub Primer Design System**
- **Shopify Polaris**
- **Atlassian Design System**
- **Material Design Components**

## 📚 **Usage Examples**

### ✅ **Correct Usage**
```tsx
// Spacing with Stack + Styling with Tailwind
<Stack spacing="lg" className="max-w-4xl mx-auto bg-card rounded-lg p-6">
  <Card className="border shadow-sm" />
  <Card className="border shadow-sm" />
</Stack>

// Horizontal spacing
<HStack spacing="md" className="justify-center">
  <Button variant="outline">Cancel</Button>
  <Button className="bg-primary">Save</Button>
</HStack>
```

### ❌ **Avoid**
```tsx
// Don't use Tailwind spacing utilities for component spacing
<div className="space-y-8">  {/* Unreliable in Tailwind v4 */}
  <Card />
  <Card />
</div>
```

## 🛠️ **Technical Implementation**

### **Stack Component**
```tsx
// Uses CSS Flexbox gap with design tokens
<div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: 'var(--space-8)' // 32px from design-tokens.css
}}>
```

### **Design Tokens**
All spacing values come from `src/styles/design-tokens.css`:
```css
--space-2: 0.5rem;   /* 8px  - xs */
--space-4: 1rem;     /* 16px - sm */
--space-6: 1.5rem;   /* 24px - md */
--space-8: 2rem;     /* 32px - lg */
--space-12: 3rem;    /* 48px - xl */
--space-16: 4rem;    /* 64px - 2xl */
```

## 🚀 **Future Maintainers**

**For AI Agents & Developers:**
1. **Always use Stack/HStack** for component spacing
2. **Always use Tailwind utilities** for colors, layout, styling
3. **Never use Tailwind spacing utilities** for design system components
4. **All spacing changes** should be made in `design-tokens.css`

This architecture ensures your components work reliably across framework updates and provides enterprise-grade maintainability.
