# Chat Layout Verification Checklist

## Manual Testing Guide for localhost:5173

Use this checklist to verify chat UI fixes work correctly across different devices and scenarios.

## ✅ Pre-Testing Setup

1. **Enable Messages v2**: 
   - Go to `/messages-example`
   - Toggle `MESSAGES_UI` flag to `ON`

2. **Test Data**: 
   - Use different test scenarios (basic, longMessages, groupedMessages, etc.)
   - Try "comprehensive" for full test coverage

## 📱 Mobile Testing (320px - 768px)

### Avatar & Bubble Layout
- [ ] Avatars are consistently sized (24px = chat token, optimized for messages)
- [ ] Avatars don't overlap with message content
- [ ] Message bubbles max-width ~280px on mobile
- [ ] Long messages wrap properly without breaking layout (break-anywhere support)
- [ ] Own messages appear on right, others on left

### Composer Behavior
- [ ] Composer stays docked at bottom
- [ ] Composer doesn't overlap last message
- [ ] Safe area respected on notch devices (iPhone X+)
- [ ] Keyboard appearance doesn't break layout
- [ ] Shift+Enter creates new line, Enter sends

### Scrolling & Z-Index
- [ ] Date dividers stick to top while scrolling
- [ ] No z-index conflicts (composer above content)
- [ ] Bottom padding allows viewing last message
- [ ] Smooth scroll to new messages

## 💻 Tablet Testing (768px - 1024px)

### Responsive Adjustments
- [ ] Message bubbles max-width ~320px on tablet
- [ ] Increased spacing feels proportional
- [ ] Chat header and composer scale appropriately

### Layout Stability
- [ ] No horizontal overflow at any width
- [ ] Transitions smooth when resizing window
- [ ] Avatar grouping works consistently

## 🖥️ Desktop Testing (1024px+)

### Maximum Width Constraints
- [ ] Message bubbles max-width ~400px on desktop
- [ ] Chat doesn't become too wide or sparse
- [ ] Desktop composer has proper touch targets

### Interaction States
- [ ] Hover states work on message bubbles
- [ ] Report menu appears on hover (non-own messages)
- [ ] Focus states visible and accessible

## 🌙 Dark Mode Testing

### Visual Consistency
- [ ] All design tokens work in dark theme
- [ ] Contrast ratios maintained
- [ ] Border colors and shadows adapt correctly

## 🚀 Performance & Edge Cases

### Data Scenarios
- [ ] **Empty State**: Clean "no messages" display
- [ ] **Long Messages**: Text wraps without breaking bubbles
- [ ] **Emoji Messages**: Renders properly sized emojis
- [ ] **Grouped Messages**: Consecutive messages from same user group correctly
- [ ] **Mixed Dates**: Date dividers appear between different days
- [ ] **System Messages**: Special styling for join/leave messages

### Stress Testing
- [ ] 50+ messages scroll smoothly
- [ ] Rapid message sending doesn't break layout
- [ ] Window resizing maintains stability

## 🎨 Design Token Verification

### No Hardcoded Values
Run `npm run style-check` to verify:
- [ ] No hardcoded pixel dimensions in message components
- [ ] No `!important` declarations
- [ ] Z-index uses design tokens
- [ ] Spacing uses `var(--space-*)` tokens

### Token Usage
- [ ] Avatar sizes: `--avatar-sm/md/lg/xl/chat` (chat=24px for messages)
- [ ] Z-layers: `--z-content/composer/floating`
- [ ] Message spacing: `--message-group-*` tokens
- [ ] Composer: `--composer-*` tokens
- [ ] Safe area: `--safe-area-inset-*` environment variables

## 🔧 Developer Experience

### Component Integration
- [ ] MessageList works standalone
- [ ] MessageComposer can be used independently
- [ ] PodChatView integrates both seamlessly
- [ ] No console errors or warnings

### Accessibility
- [ ] Screen reader can navigate messages
- [ ] Focus management works properly
- [ ] ARIA labels are descriptive
- [ ] Keyboard navigation functional

## 🐛 Common Issues to Check

### Layout Breaks
- [ ] Composer never overlaps last message
- [ ] Avatars don't compress or stretch
- [ ] Message bubbles don't exceed container width
- [ ] Date dividers don't interfere with scrolling

### Visual Glitches  
- [ ] No flickering during message updates
- [ ] Smooth transitions between states
- [ ] Consistent border radius on message bubbles
- [ ] Proper spacing between message groups

## 📊 Testing Results Template

```
Device: [Mobile/Tablet/Desktop]
Screen Size: [Width x Height]
Browser: [Chrome/Safari/Firefox]
Date: [YYYY-MM-DD]

✅ Passed Tests: [X/Total]
❌ Failed Tests: [List specific failures]
📝 Notes: [Any observations]
```

## 🚨 Known Issues

Document any discovered issues here:

- Issue 1: [Description and steps to reproduce]
- Issue 2: [Description and workaround]

## 📞 Need Help?

If you discover layout issues:

1. Check browser console for errors
2. Verify design tokens are loading correctly
3. Test in incognito mode to rule out extensions
4. Compare with `/messages-example` test scenarios

## ✨ Success Criteria

All tests pass when:
- Chat UI works seamlessly across all device sizes
- No hardcoded values in message components
- Design tokens control all sizing and spacing
- Accessibility standards met
- Performance remains smooth with large message lists
