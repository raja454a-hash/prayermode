

# Fix: Node.js Version Update

## Problem
Capacitor CLI v8 requires Node.js 22+, but the GitHub Actions workflow is using Node.js 20.

## Solution
Change `node-version: 20` to `node-version: 22` in the workflow file (line 19).

## Technical Details
- **File**: `.github/workflows/build-android.yml`
- **Change**: Line 19: `node-version: 20` -> `node-version: 22`
- Only one line change needed

## After Fix
GitHub pe dobara push karo, build successfully complete hoga.

