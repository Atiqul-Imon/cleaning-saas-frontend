# Next.js Troubleshooting Guide

## ✅ Server Status: WORKING

Your Next.js server IS running and responding correctly. The issue is likely browser/client-side.

## Common Issues & Solutions

### 1. Browser Shows "Loading" Forever

**Symptoms:** Page appears to load but never finishes, browser spinner keeps spinning

**Causes:**

- Client-side JavaScript hanging (API calls without timeout)
- Browser cache issues
- React hydration errors
- Network requests blocking

**Solutions:**

#### A. Clear Browser Cache

```bash
# In Chrome/Edge: Ctrl+Shift+Delete
# Or use incognito/private mode
```

#### B. Check Browser Console

1. Open DevTools (F12)
2. Check Console tab for errors
3. Check Network tab for hanging requests
4. Look for red errors or warnings

#### C. Test in Different Browser

Try Firefox, Chrome, or Edge to isolate browser-specific issues

#### D. Check for Hanging API Calls

The `useUserRole` hook has been fixed with a 5-second timeout, but check:

- Open DevTools → Network tab
- Look for requests that never complete
- Check if backend API is running (http://localhost:5000)

### 2. Slow First Load (2-3 seconds)

**This is normal** for Next.js development mode:

- First compilation: ~2 seconds
- Subsequent loads: Much faster (cached)

**To improve:**

- Use production build: `npm run build && npm start`
- Or wait for initial compilation to complete

### 3. Port Already in Use

**Error:** `Port 3000 is already in use`

**Solution:**

```bash
# Find process using port 3000
lsof -i :3000
# or
fuser -k 3000/tcp

# Kill the process
kill -9 <PID>
```

### 4. System Resources

**Check if system is overloaded:**

```bash
# Memory
free -h

# CPU
top

# Disk space
df -h
```

**If low on resources:**

- Close other applications
- Restart your computer
- Clean `.next` folder: `npm run clean`

### 5. Node.js Version Issues

**Current:** Node.js v22.11.0 (very new, might have compatibility issues)

**If experiencing issues:**

```bash
# Check Node.js version
node --version

# Consider using Node.js LTS (v20.x)
nvm install 20
nvm use 20
```

### 6. Workspace Root Warning

**Warning:** Multiple lockfiles detected

**Solution:**

```bash
# Remove extra lockfile if not needed
rm /home/atiqul-islam/package-lock.json

# Or set turbopack.root in next.config.ts (already done)
```

## Quick Diagnostic Steps

1. **Verify server is running:**

   ```bash
   curl http://localhost:3000
   # Should return HTML, not error
   ```

2. **Check browser console:**
   - Open DevTools (F12)
   - Look for JavaScript errors
   - Check Network tab for failed requests

3. **Test in incognito mode:**
   - Eliminates cache/browser extension issues

4. **Check backend API:**

   ```bash
   curl http://localhost:5000/health
   # Backend should be running for full functionality
   ```

5. **Monitor server logs:**
   - Watch terminal where `npm run dev` is running
   - Look for compilation errors or warnings

## Performance Tips

1. **Clean build cache:**

   ```bash
   npm run clean
   ```

2. **Use production mode for testing:**

   ```bash
   npm run build
   npm start
   ```

3. **Reduce memory usage:**
   - Already configured: `--max-old-space-size=2048`
   - Increase if needed: `--max-old-space-size=4096`

4. **Close unnecessary applications:**
   - Chrome tabs
   - Other Node.js processes
   - Heavy IDE features

## Still Not Working?

1. **Full reset:**

   ```bash
   cd frontend
   rm -rf .next node_modules
   npm install
   npm run dev
   ```

2. **Check system logs:**

   ```bash
   journalctl -xe | grep -i error
   ```

3. **Test minimal Next.js app:**
   ```bash
   npx create-next-app@latest test-app
   cd test-app
   npm run dev
   ```

If minimal app works but your project doesn't, the issue is project-specific.
