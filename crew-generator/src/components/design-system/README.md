# Design System Components

## 🏗️ **Architecture Philosophy**

This design system uses a **design token-first approach** that combines the best of CSS-in-JS and Tailwind CSS for maximum reliability and maintainability.

> 📖 **For comprehensive documentation**, see [`DESIGN_SYSTEM_ARCHITECTURE.md`](../../../DESIGN_SYSTEM_ARCHITECTURE.md)

## 🎨 **Design Token Integration**

All components now use design tokens from `src/styles/design-tokens.css` for consistent sizing and spacing:

```css
/* Component tokens control all sizing */
--button-height-default: var(--space-14);    /* 56px */
--input-height-default: var(--space-14);     /* 56px */
--button-padding-x-default: var(--space-8);  /* 32px */
```

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

## 🧩 **Component Usage**

### **Form Components**
```tsx
// ✅ Use design system components in forms
import { FormField, ModernInput, ModernButton } from '@/components/design-system'

<FormField label="Artist Name">
  <ModernInput placeholder="Enter artist name" />
</FormField>
<ModernButton modernSize="large" fullWidth>Submit</ModernButton>
```

### **Button Components**
```tsx
// ✅ Design system button with proper sizing
<ModernButton modernSize="large">Large Button</ModernButton>

// ✅ Base button with size variants
<Button size="lg">Large Button</Button>

// ❌ Never hardcode sizes
<Button className="h-14 px-8">Button</Button>
```

### **Input Components**
```tsx
// ✅ Use ModernInput for forms (uses design tokens)
<ModernInput />

// ❌ Avoid base Input in forms (has hardcoded h-9)
<Input className="h-14" />
```

## 🚀 **Future Maintainers**

**For AI Agents & Developers:**
1. **Always use design system components** (`ModernButton`, `ModernInput`) in forms
2. **Always use Stack/HStack** for component spacing
3. **Always use design tokens** - never hardcode values
4. **Never use !important** in CSS - use component variants instead
5. **All sizing changes** should be made in `design-tokens.css`

**Key Files:**
- [`DESIGN_SYSTEM_ARCHITECTURE.md`](../../../DESIGN_SYSTEM_ARCHITECTURE.md) - Complete system documentation
- [`design-tokens.css`](../../styles/design-tokens.css) - All design tokens
- [`design-system/index.ts`](./index.ts) - Component exports

This architecture ensures your components work reliably across framework updates and provides enterprise-grade maintainability.
