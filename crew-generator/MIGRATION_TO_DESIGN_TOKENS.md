# 🔄 Migration Guide: From Hardcoded Styles to Design Tokens

## 📋 **Quick Reference**

This guide helps migrate existing components from hardcoded styles to our design token system.

## 🚨 **Before You Start**

**Read First**: [`DESIGN_SYSTEM_ARCHITECTURE.md`](./DESIGN_SYSTEM_ARCHITECTURE.md) for complete system overview.

## 🔍 **Identifying Components That Need Migration**

### **Red Flags - Components That Need Migration**

1. **Hardcoded Heights/Widths**
   ```tsx
   // ❌ Needs migration
   <Button className="h-14 px-8 py-4">Submit</Button>
   <Input className="h-12" />
   ```

2. **CSS with !important**
   ```css
   /* ❌ Needs migration */
   .button {
     height: 56px !important;
     padding: 16px 32px !important;
   }
   ```

3. **Inline Styles**
   ```tsx
   // ❌ Needs migration
   <div style={{ height: '56px', padding: '16px 32px' }}>
   ```

4. **Magic Numbers**
   ```tsx
   // ❌ Needs migration
   <div className="h-[56px] px-[32px]">
   ```

## 🛠️ **Migration Steps**

### **Step 1: Button Components**

#### **Before (Hardcoded)**
```tsx
// ❌ Old approach
<Button className="h-14 px-8 py-4 w-full">
  Create Event
</Button>
```

#### **After (Design Tokens)**
```tsx
// ✅ New approach
<ModernButton modernSize="large" fullWidth>
  Create Event
</ModernButton>
```

**Or use base Button with proper variants:**
```tsx
// ✅ Alternative approach
<Button size="lg" fullWidth>
  Create Event
</Button>
```

### **Step 2: Input Components**

#### **Before (Hardcoded)**
```tsx
// ❌ Old approach
<Input className="h-14 px-4 py-3" />
```

#### **After (Design Tokens)**
```tsx
// ✅ New approach
<ModernInput />
```

### **Step 3: Form Fields**

#### **Before (Manual Layout)**
```tsx
// ❌ Old approach
<div className="space-y-4">
  <div>
    <label className="block text-sm font-medium mb-2">
      Artist Name
    </label>
    <Input className="h-14" />
  </div>
  <Button className="h-14 px-8 w-full">Submit</Button>
</div>
```

#### **After (Design System)**
```tsx
// ✅ New approach
<Stack spacing="lg">
  <FormField label="Artist Name">
    <ModernInput />
  </FormField>
  <ModernButton modernSize="large" fullWidth>
    Submit
  </ModernButton>
</Stack>
```

### **Step 4: CSS Overrides**

#### **Before (CSS !important)**
```css
/* ❌ Remove from CSS files */
button[data-slot="button"] {
  height: 56px !important;
  padding: 16px 32px !important;
}
```

#### **After (Component Variants)**
```tsx
// ✅ Use proper component variants
<Button size="lg">Button</Button>
```

## 📝 **Common Migration Patterns**

### **Pattern 1: Form Buttons**
```tsx
// ❌ Before
<button className="h-14 px-8 py-4 bg-blue-600 text-white rounded-xl w-full">
  Submit
</button>

// ✅ After
<ModernButton modernSize="large" fullWidth>
  Submit
</ModernButton>
```

### **Pattern 2: Form Inputs**
```tsx
// ❌ Before
<input className="h-14 px-4 py-3 border rounded-xl w-full" />

// ✅ After
<ModernInput />
```

### **Pattern 3: Card Layouts**
```tsx
// ❌ Before
<div className="p-6 space-y-4">
  <h2>Title</h2>
  <p>Content</p>
</div>

// ✅ After
<Card className="p-[var(--card-padding-md)]">
  <Stack spacing="md">
    <h2>Title</h2>
    <p>Content</p>
  </Stack>
</Card>
```

## 🔧 **Migration Checklist**

### **For Each Component:**

- [ ] **Remove hardcoded heights** (`h-14`, `h-12`, etc.)
- [ ] **Remove hardcoded padding** (`px-8`, `py-4`, etc.)
- [ ] **Remove inline styles** with magic numbers
- [ ] **Replace with design system components** (`ModernButton`, `ModernInput`)
- [ ] **Use proper component variants** (`size="lg"`, `modernSize="large"`)
- [ ] **Test responsive behavior** across screen sizes

### **For CSS Files:**

- [ ] **Remove !important declarations**
- [ ] **Remove hardcoded pixel values**
- [ ] **Replace with design token references**
- [ ] **Use component variants instead of CSS overrides**

### **For Forms:**

- [ ] **Use FormField component** for consistent labeling
- [ ] **Use ModernInput** instead of base Input
- [ ] **Use ModernButton** for form actions
- [ ] **Use Stack component** for spacing

## 🧪 **Testing Migration**

### **Visual Testing**
1. **Before migration**: Take screenshots of components
2. **After migration**: Compare visual output
3. **Responsive testing**: Test on mobile, tablet, desktop
4. **Interactive testing**: Test hover, focus, active states

### **Code Testing**
```bash
# Build to check for TypeScript errors
npm run build

# Run development server
npm run dev
```

### **Browser Testing**
```javascript
// Check design tokens in browser console
getComputedStyle(document.documentElement).getPropertyValue('--button-height-default')
// Should return: "3.5rem" (56px)
```

## 🚨 **Common Migration Issues**

### **Issue 1: TypeScript Errors**
```
Type 'large' is not assignable to type 'sm | md | lg'
```
**Solution**: Use correct prop names
```tsx
// ❌ Wrong
<ModernButton size="large" />

// ✅ Correct
<ModernButton modernSize="large" />
```

### **Issue 2: Styles Not Applying**
**Symptoms**: Components look the same after migration
**Solution**: Clear build cache
```bash
rm -rf dist/ node_modules/.vite/
npm install
npm run build
```

### **Issue 3: Inconsistent Sizing**
**Symptoms**: Some buttons are different sizes
**Solution**: Use consistent components
```tsx
// ❌ Mixed approaches
<Button className="h-14">Button 1</Button>
<ModernButton>Button 2</ModernButton>

// ✅ Consistent approach
<ModernButton modernSize="large">Button 1</ModernButton>
<ModernButton modernSize="large">Button 2</ModernButton>
```

## 📚 **Resources**

- **[Design System Architecture](./DESIGN_SYSTEM_ARCHITECTURE.md)** - Complete system overview
- **[Component Documentation](./src/components/design-system/README.md)** - Usage examples
- **[Design Tokens](./src/styles/design-tokens.css)** - All available tokens

## 🎯 **Success Criteria**

Migration is complete when:

- ✅ **No hardcoded values** in component code
- ✅ **No !important** in CSS files
- ✅ **Consistent component usage** across pages
- ✅ **TypeScript builds** without errors
- ✅ **Visual consistency** maintained or improved
- ✅ **Responsive behavior** works correctly

---

**Need Help?** Check the troubleshooting section in [`DESIGN_SYSTEM_ARCHITECTURE.md`](./DESIGN_SYSTEM_ARCHITECTURE.md#troubleshooting)



