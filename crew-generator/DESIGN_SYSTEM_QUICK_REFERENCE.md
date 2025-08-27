# 🚀 Design System Quick Reference

## 📋 **TL;DR - What Changed**

We eliminated all hardcoded styles and implemented a **design token-first architecture**. All component sizing now uses centralized design tokens.

## 🎯 **For Developers**

### **✅ DO - Use These Components**

```tsx
// Forms
import { FormField, ModernInput, ModernButton } from '@/components/design-system'

<FormField label="Artist Name">
  <ModernInput placeholder="Enter artist" />
</FormField>
<ModernButton modernSize="large" fullWidth>Submit</ModernButton>

// Buttons
<Button size="lg">Large Button</Button>
<Button size="md">Medium Button</Button>
<Button size="sm">Small Button</Button>

// Layout
<Stack spacing="lg">
  <Card />
  <Card />
</Stack>
```

### **❌ DON'T - Avoid These Patterns**

```tsx
// Never hardcode sizes
<Button className="h-14 px-8">❌</Button>
<Input className="h-14">❌</Input>

// Never use !important in CSS
button { height: 56px !important; } /* ❌ */

// Never use base Input in forms
<Input />  /* ❌ - has hardcoded h-9 */
```

## 🎨 **Design Tokens**

### **Button Sizes**
```css
--button-height-sm: 36px      /* size="sm" */
--button-height-md: 48px      /* size="md" */  
--button-height-lg: 56px      /* size="lg" */
--button-height-default: 56px /* size="default" */
```

### **Input Sizes**
```css
--input-height-default: 56px  /* ModernInput */
--input-padding-x: 16px       /* Horizontal padding */
--input-padding-y: 12px       /* Vertical padding */
```

## 🔧 **Common Tasks**

### **Change Button Height Globally**
```css
/* In design-tokens.css */
--button-height-default: var(--space-12); /* 48px instead of 56px */
```
→ All buttons automatically update!

### **Create New Form**
```tsx
<PageLayout>
  <PageHeader title="Form Title" />
  <Stack spacing="lg">
    <FormField label="Field 1">
      <ModernInput />
    </FormField>
    <FormField label="Field 2">
      <ModernInput />
    </FormField>
    <ModernButton modernSize="large" fullWidth>
      Submit
    </ModernButton>
  </Stack>
</PageLayout>
```

### **Fix Existing Component**
```tsx
// Before
<Button className="h-14 px-8 w-full">Submit</Button>

// After  
<ModernButton modernSize="large" fullWidth>Submit</ModernButton>
```

## 🚨 **Troubleshooting**

### **Styles Not Applying?**
```bash
# Clear cache and rebuild
rm -rf dist/ node_modules/.vite/
npm run build
```

### **TypeScript Errors?**
```tsx
// Wrong prop name
<ModernButton size="large" />  // ❌

// Correct prop name  
<ModernButton modernSize="large" />  // ✅
```

### **Inconsistent Button Sizes?**
Use the same component everywhere:
```tsx
// ❌ Mixed approaches
<Button className="h-14">Button 1</Button>
<ModernButton>Button 2</ModernButton>

// ✅ Consistent approach
<ModernButton modernSize="large">Button 1</ModernButton>
<ModernButton modernSize="large">Button 2</ModernButton>
```

## 📚 **Full Documentation**

- **[Complete Architecture Guide](./DESIGN_SYSTEM_ARCHITECTURE.md)** - Comprehensive system docs
- **[Migration Guide](./MIGRATION_TO_DESIGN_TOKENS.md)** - How to migrate existing code
- **[Component Docs](./src/components/design-system/README.md)** - Usage examples

## 🎉 **Key Benefits**

1. **Single Source of Truth** - Change button height once, affects entire app
2. **No More Conflicts** - Eliminated all `!important` CSS overrides  
3. **Type Safety** - Proper TypeScript interfaces with variants
4. **Easy Maintenance** - Update design tokens to change entire system
5. **Consistent UI** - All components use same sizing system

---

**Questions?** Check the troubleshooting section in the full architecture guide!



