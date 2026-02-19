# Performance Optimization Tips

## Quick Fixes for Slow Next.js Development

### 1. Clean Build Cache

If your `.next` folder is too large (>500MB), clean it:

```bash
npm run clean
# or manually:
rm -rf .next
```

### 2. Restart Dev Server with Clean Cache

```bash
npm run dev:clean
```

### 3. Reduce Memory Usage

The dev server now uses a 2GB memory limit. If you need more:

- Edit `package.json` and increase `--max-old-space-size=2048` to `4096` or `8192`
- Close other applications to free up memory

### 4. System-Level Optimizations

#### Check System Resources

```bash
# Check memory usage
free -h

# Check disk space
df -h

# Check running processes
ps aux | grep node
```

#### Kill Stuck Node Processes

```bash
# Find Node processes
ps aux | grep node

# Kill all Node processes (be careful!)
pkill -f node
```

### 5. Development Mode Optimizations

- **Close unused browser tabs** - Chrome/Chromium can consume significant memory
- **Disable React Query DevTools in production** - Already done in code
- **Use `npm run dev:clean`** when experiencing issues
- **Restart your IDE** if it's consuming too much memory

### 6. If Still Slow

1. **Check for memory leaks** in browser DevTools
2. **Monitor system resources** while dev server runs
3. **Reduce file watchers** - The config now ignores `node_modules` and `.next`
4. **Use production build** for testing: `npm run build && npm start`

### 7. Emergency Cleanup

If everything is slow:

```bash
# Stop all Node processes
pkill -f node

# Clean Next.js cache
cd frontend
rm -rf .next node_modules/.cache

# Reinstall if needed (last resort)
rm -rf node_modules
npm install
```
