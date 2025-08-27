# Repository Setup Instructions

## Initial Setup
Your repository is now configured for: https://github.com/mrleemurray/vscode-issue-filer

## Next Steps

### 1. Push to GitHub
```bash
cd /Users/leemurray/Documents/WORK/D3/VS_CODE/tools/issue-filer
git init
git add .
git commit -m "Initial commit: VS Code Issue Filer extension"
git branch -M main
git remote add origin https://github.com/mrleemurray/vscode-issue-filer.git
git push -u origin main
```

### 2. Create PNG Icon
Convert the SVG icon to PNG format (128x128px):
- Use any image editor or online converter
- Save as `icon.png` in the root directory
- The extension currently references `icon.png` in package.json

### 3. Register as VS Code Publisher
1. Go to https://marketplace.visualstudio.com/manage
2. Sign in with your Microsoft account
3. Create a publisher profile with ID: `mrleemurray`
4. Get your personal access token

### 4. Install VSCE
```bash
npm install -g vsce
```

### 5. Package and Publish
```bash
# Test packaging
vsce package

# Publish to marketplace
vsce publish
```

## Repository Configuration ✅
- ✅ Publisher: `mrleemurray`
- ✅ Repository URLs: https://github.com/mrleemurray/vscode-issue-filer
- ✅ License: MIT (Microsoft Corporation)
- ✅ Keywords for discoverability
- ✅ All extension functionality complete

## Still Needed
- [ ] Convert icon.svg to icon.png (128x128px)
- [ ] Push code to GitHub repository
- [ ] Register VS Code marketplace publisher account
- [ ] Publish extension

Your extension is ready for the marketplace! 🚀