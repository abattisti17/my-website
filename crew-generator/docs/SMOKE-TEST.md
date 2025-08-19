# Travel Crew Generator - Smoke Test Checklist

## Overview
This checklist verifies core functionality after deployment or major changes. Run these tests in order on a fresh browser session.

**Environment:** `http://localhost:5173` (development) or your staging URL  
**Prerequisites:** Clean browser state, Supabase backend accessible

---

## 🔐 Authentication Flow

### Test 1: Magic Link Sign-In
- [ ] Navigate to `/auth`
- [ ] Enter a valid email address
- [ ] Click "Send Magic Link"
- [ ] Check email for magic link message
- [ ] Click the magic link → should redirect to app homepage
- [ ] Verify you're signed in (user menu/profile appears)

### Test 2: Profile Creation
- [ ] Check Supabase `profiles` table for new row with your user ID
- [ ] Verify `display_name` field is populated (email prefix or custom name)
- [ ] Sign out and sign back in → profile persists

---

## 🎵 Event Management

### Test 3: Join Sample Event
- [ ] Navigate to homepage `/`
- [ ] Find the test event: **"[test] Taylor Swift - NYC 2025"**
- [ ] Click "View Event" → navigate to event page
- [ ] Click "🚀 Join the Crew" button
- [ ] Verify success toast: "Welcome to the crew! 🎉"
- [ ] Confirm you appear in the "Crew Members" section

### Test 4: Event Persistence
- [ ] Refresh the event page (F5)
- [ ] Verify you're still listed as a crew member
- [ ] Check Supabase `event_members` table for your entry
- [ ] Leave and rejoin event → should handle gracefully

---

## 💬 Pod Chat System

### Test 5: Create Pod
- [ ] From event page, click "➕ Create First Pod" or "Create New Pod"
- [ ] Enter pod name: `Test Pod - {timestamp}`
- [ ] Click "Create Pod"
- [ ] Verify success toast and redirect to pod chat page
- [ ] Confirm pod appears in event's pod list

### Test 6: Real-time Chat (Multi-tab)
- [ ] **Tab 1:** Stay on pod chat page
- [ ] **Tab 2:** Open same pod URL in new tab (same browser)
- [ ] **Tab 1:** Send message: "Hello from tab 1! 👋"
- [ ] **Tab 2:** Verify message appears in real-time (within 2 seconds)
- [ ] **Tab 2:** Send reply: "Tab 2 responding! 🎉"
- [ ] **Tab 1:** Verify reply appears in real-time
- [ ] Close one tab, send message from other → should still work

### Test 7: Chat Persistence
- [ ] Refresh pod page (F5)
- [ ] Verify all previous messages are still visible
- [ ] Check Supabase `messages` table for entries
- [ ] Verify correct `pod_id`, `user_id`, and `text` fields

---

## 📍 Meet Point Feature

### Test 8: Set Meet Point
- [ ] From event page, scroll to "📍 Meet Point" section
- [ ] Click "Set Meet Point" or edit existing
- [ ] Enter location: `Coffee shop near venue entrance`
- [ ] Enter time: `30 minutes before doors`
- [ ] Save changes
- [ ] Verify success toast and display updates

### Test 9: Meet Point Persistence
- [ ] Refresh event page (F5)
- [ ] Verify meet point text persists
- [ ] Check Supabase `meet_points` table for entry
- [ ] Update meet point again → should overwrite, not duplicate

---

## 📸 Photo Upload System

### Test 10: Upload Photo
- [ ] From event page, click "📷 Add Photo" button
- [ ] Select an image file (< 2MB, JPG/PNG/WebP)
- [ ] Wait for upload → verify success toast: "Photo uploaded successfully! 📸"
- [ ] Check image appears in "📸 Event Photos" gallery
- [ ] Verify image has your name and timestamp

### Test 11: Photo on Memorabilia Page
- [ ] Navigate to `/event/{slug}/memorabilia`
- [ ] Verify uploaded photo appears (if memorabilia displays media)
- [ ] Check Supabase `media` table for entry
- [ ] Verify `url`, `owner_id`, `event_id` fields are correct

---

## 🔗 Deep Linking & SPA Routing

### Test 12: Deep Link Navigation
- [ ] Get a pod URL: `/event/taylor-nyc-2025/pod/{pod-id}`
- [ ] **Hard reload** the page (Ctrl+F5 or Cmd+Shift+R)
- [ ] Verify page loads correctly (no 404 error)
- [ ] Check that SPA routing works (React components render)
- [ ] Try other deep links: `/event/{slug}`, `/tour`, `/auth`

### Test 13: Browser Back/Forward
- [ ] Navigate: Home → Event → Pod → Back → Forward
- [ ] Verify URL changes correctly
- [ ] Confirm no page refreshes (SPA behavior)
- [ ] Test with browser back/forward buttons

---

## 📱 PWA (Progressive Web App)

### Test 14: PWA Installation
- [ ] **Chrome/Edge:** Look for install prompt or address bar install icon
- [ ] **Safari:** Share → Add to Home Screen
- [ ] Install the app to home screen/desktop
- [ ] Launch from home screen icon
- [ ] Verify it opens in standalone mode (no browser UI)

### Test 15: Offline Shell
- [ ] With PWA installed, open the app
- [ ] **Disconnect internet** (airplane mode or disable WiFi)
- [ ] Close and reopen PWA
- [ ] Verify basic shell loads (even if data doesn't load)
- [ ] Check service worker is registered in DevTools > Application > Service Workers
- [ ] Reconnect internet → functionality should restore

---

## 🚨 Error Handling

### Test 16: Report System
- [ ] In pod chat, find a message from another user
- [ ] Hover over message → click three-dot menu
- [ ] Click "🚨 Report" → enter reason → submit
- [ ] Verify success toast: "Thanks for the report..."
- [ ] Confirm message is hidden optimistically
- [ ] Check Supabase `reports` table for entry

### Test 17: Pod Capacity
- [ ] Create or join a pod with 4 members
- [ ] Try to add a 6th member (use different browser/account if needed)
- [ ] Verify error: "Pod full — create another."
- [ ] Confirm database trigger prevents overflow

---

## ✅ Sign-off Checklist

**Core Functionality:**
- [ ] Authentication (magic link)
- [ ] Event joining/leaving
- [ ] Pod creation and chat
- [ ] Real-time messaging
- [ ] Photo uploads
- [ ] Meet point management
- [ ] Deep linking
- [ ] PWA installation

**Data Persistence:**
- [ ] User profiles
- [ ] Event memberships
- [ ] Messages and pods
- [ ] Meet points
- [ ] Media uploads
- [ ] Reports

**User Experience:**
- [ ] Loading states
- [ ] Error messages
- [ ] Success feedback
- [ ] Mobile responsive
- [ ] Offline capability

**Security & Safety:**
- [ ] Route guards (auth required)
- [ ] Report system working
- [ ] Pod capacity enforcement
- [ ] RLS policies active

---

## 🐛 If Tests Fail

1. **Check browser console** for JavaScript errors
2. **Verify Supabase connection** in Network tab
3. **Check environment variables** (.env.local)
4. **Test database queries** in Supabase dashboard
5. **Clear browser cache** and retry
6. **Check service worker** in DevTools > Application

## 📋 Test Results Template

```
Date: ___________
Tester: ___________
Environment: ___________
Browser: ___________

✅ Authentication: PASS
✅ Event Management: PASS
✅ Pod Chat: PASS
✅ Meet Points: PASS
✅ Photo Upload: PASS
✅ Deep Linking: PASS
✅ PWA Features: PASS

Issues Found:
- 
- 
- 

Overall Status: PASS / FAIL
```
