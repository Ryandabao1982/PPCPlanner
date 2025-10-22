# Installation Guide

Complete installation and setup instructions for the GoodWit PPC Planner.

---

## Table of Contents

- [System Requirements](#system-requirements)
- [Quick Installation](#quick-installation)
- [Detailed Installation](#detailed-installation)
- [Configuration](#configuration)
- [Development Setup](#development-setup)
- [Production Deployment](#production-deployment)
- [Troubleshooting](#troubleshooting)

---

## System Requirements

### Minimum Requirements
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- **RAM**: 4 GB
- **Disk Space**: 500 MB (including dependencies)
- **Browser**: Modern browser (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)

### Recommended Requirements
- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **RAM**: 8 GB
- **Disk Space**: 1 GB
- **Internet**: Stable connection (for AI features)

### Operating System Support
- ✅ Windows 10/11
- ✅ macOS 10.15 (Catalina) or higher
- ✅ Linux (Ubuntu 20.04+, Debian 10+, Fedora 34+, etc.)

---

## Quick Installation

For experienced developers who want to get started quickly:

```bash
# Clone repository
git clone https://github.com/Ryandabao1982/PPCPlanner.git
cd PPCPlanner

# Install dependencies
npm install

# Start development server
npm run dev
```

Open http://localhost:5173 in your browser.

---

## Detailed Installation

### Step 1: Install Node.js and npm

#### Windows
1. Download Node.js installer from [nodejs.org](https://nodejs.org/)
2. Run the installer (.msi file)
3. Follow installation wizard
4. Verify installation:
   ```cmd
   node --version
   npm --version
   ```

#### macOS
Using Homebrew (recommended):
```bash
brew install node
```

Or download from [nodejs.org](https://nodejs.org/)

Verify installation:
```bash
node --version
npm --version
```

#### Linux
Using package manager (Ubuntu/Debian):
```bash
# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

For other distributions, see [Node.js installation guide](https://nodejs.org/en/download/package-manager/).

### Step 2: Clone the Repository

Using HTTPS:
```bash
git clone https://github.com/Ryandabao1982/PPCPlanner.git
cd PPCPlanner
```

Using SSH (if you have SSH keys set up):
```bash
git clone git@github.com:Ryandabao1982/PPCPlanner.git
cd PPCPlanner
```

Or download as ZIP:
1. Go to [GitHub repository](https://github.com/Ryandabao1982/PPCPlanner)
2. Click "Code" → "Download ZIP"
3. Extract the ZIP file
4. Navigate to the extracted folder in terminal

### Step 3: Install Dependencies

```bash
npm install
```

This will install:
- React and React DOM
- TypeScript compiler
- Vite build tool
- Google Gemini AI SDK
- jsPDF libraries
- Vitest testing framework
- All development dependencies

**Installation Time**: 1-3 minutes depending on internet speed

**Disk Space**: ~150 MB in `node_modules/`

### Step 4: Verify Installation

Run the health check:
```bash
npm run dev -- --version
```

Check if all dependencies are installed correctly:
```bash
npm list --depth=0
```

Expected output should show all dependencies without errors.

---

## Configuration

### Environment Variables (Optional)

The application works without configuration, but AI features require a Google Gemini API key.

#### Create Environment File

```bash
# Copy example file
cp .env.example .env.local

# Or create new file
touch .env.local
```

#### Add API Key

Edit `.env.local`:
```env
# Google Gemini AI API Key (for AI Report Generator)
GEMINI_API_KEY=your_actual_api_key_here
```

#### Getting a Gemini API Key

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Sign in with Google account
3. Click "Get API Key"
4. Create new API key
5. Copy the key
6. Paste into `.env.local`

**Note**: Free tier includes:
- 60 requests per minute
- 1500 requests per day
- Sufficient for typical usage

#### Security Warning

⚠️ **Never commit `.env.local` to version control!**

The `.gitignore` file already excludes `.env.local`, but double-check:
```bash
git status
# Should NOT show .env.local
```

---

## Development Setup

### Start Development Server

```bash
npm run dev
```

Output:
```
  VITE v6.4.1  ready in 543 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h to show help
```

#### Development Features
- ⚡ Hot Module Replacement (HMR)
- 🔄 Auto-reload on file changes
- 🐛 Source maps for debugging
- 📝 TypeScript type checking in IDE
- 🎯 React Fast Refresh

### Access the Application

Open your browser and navigate to:
```
http://localhost:5173
```

Or if using network access:
```bash
npm run dev -- --host
```
Then access from other devices on your network.

### Development Workflow

1. **Edit code** in your preferred editor
2. **Save file** - changes appear instantly in browser
3. **Check console** for errors or warnings
4. **Test features** in browser
5. **Commit changes** when ready

### IDE Setup (Optional but Recommended)

#### Visual Studio Code
Recommended extensions:
- ESLint
- Prettier
- TypeScript and JavaScript
- ES7+ React/Redux/React-Native snippets
- Auto Rename Tag
- Bracket Pair Colorizer

Install extensions:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-typescript-next
```

#### VS Code Settings (`.vscode/settings.json`)
```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## Production Deployment

### Build for Production

```bash
npm run build
```

Output:
```
vite v6.4.1 building for production...
✓ 307 modules transformed.
dist/index.html                   1.38 kB
dist/assets/index-[hash].js    1,069.71 kB
✓ built in 3.93s
```

Built files are in `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

Opens at http://localhost:4173

Test the production build locally before deploying.

### Deployment Options

#### Option 1: GitHub Pages (Recommended for Free Hosting)

1. **Configure repository**:
   - Go to Settings → Pages
   - Source: GitHub Actions
   - Workflow file is already configured: `.github/workflows/jekyll-gh-pages.yml`

2. **Push to main branch**:
   ```bash
   git add .
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

3. **Access deployed site**:
   - URL: `https://yourusername.github.io/PPCPlanner/`

#### Option 2: Netlify

1. **Install Netlify CLI** (optional):
   ```bash
   npm install -g netlify-cli
   ```

2. **Deploy**:
   ```bash
   netlify deploy --prod
   ```

3. **Or use Netlify Dashboard**:
   - Connect GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Auto-deploy on push

#### Option 3: Vercel

1. **Install Vercel CLI** (optional):
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Or use Vercel Dashboard**:
   - Import repository
   - Framework preset: Vite
   - Auto-deploy on push

#### Option 4: AWS S3 + CloudFront

1. **Build application**:
   ```bash
   npm run build
   ```

2. **Upload to S3**:
   ```bash
   aws s3 sync dist/ s3://your-bucket-name/
   ```

3. **Configure CloudFront**:
   - Create distribution
   - Point to S3 bucket
   - Set default root object: `index.html`
   - Configure error pages (404 → index.html)

4. **Set up custom domain** (optional)

#### Option 5: Static File Server

For any web server (Nginx, Apache, etc.):

1. **Build application**:
   ```bash
   npm run build
   ```

2. **Copy `dist/` contents** to web server root

3. **Configure server** for SPA:
   - Nginx: Redirect all requests to `index.html`
   - Apache: Use `.htaccess` with mod_rewrite

**Nginx Example**:
```nginx
server {
    listen 80;
    server_name example.com;
    root /var/www/ppc-planner;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

**Apache `.htaccess`**:
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

### Environment Variables for Production

Set environment variables in your hosting platform:

**Netlify/Vercel**:
- Add in dashboard under Environment Variables
- Prefix with `VITE_` for client-side access

**GitHub Pages**:
- Use GitHub Secrets
- Access in workflow file

**Other Platforms**:
- Follow platform-specific instructions
- Ensure API keys are kept secret

---

## Troubleshooting

### Common Installation Issues

#### Issue: `npm install` fails with permission errors

**Linux/macOS**:
```bash
# Don't use sudo, fix npm permissions instead
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Windows**:
- Run terminal as Administrator
- Or use Node Version Manager (nvm)

#### Issue: Port 5173 already in use

**Solution**:
```bash
# Use different port
npm run dev -- --port 3000
```

Or kill the process using port 5173:
```bash
# Linux/macOS
lsof -ti:5173 | xargs kill -9

# Windows
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

#### Issue: Node version is too old

**Solution**:
```bash
# Check current version
node --version

# Install/update Node.js
# Use nvm (Node Version Manager) for easy version management
nvm install 20
nvm use 20
```

#### Issue: `npm run build` fails with out of memory

**Solution**:
```bash
# Increase Node.js memory limit
NODE_OPTIONS=--max-old-space-size=4096 npm run build
```

#### Issue: TypeScript errors during development

**Solution**:
```bash
# Rebuild TypeScript
npm run build

# Or check errors without building
npx tsc --noEmit
```

#### Issue: Vite cache corruption

**Solution**:
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

### Platform-Specific Issues

#### macOS: Command not found after installation

**Solution**:
```bash
# Add npm global to PATH
echo 'export PATH="/usr/local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### Windows: Git not found

**Solution**:
1. Install Git from [git-scm.com](https://git-scm.com/)
2. Add Git to PATH
3. Restart terminal

#### Linux: Node.js permission denied

**Solution**:
```bash
# Fix permissions
sudo chown -R $USER:$GROUP ~/.npm
sudo chown -R $USER:$GROUP ~/.config
```

### Getting Help

If you encounter issues not covered here:

1. **Check documentation**:
   - [README.md](../README.md)
   - [FEATURES.md](docs/FEATURES.md)
   - [BUILD_LOG.md](BUILD_LOG.md)

2. **Search existing issues**:
   - [GitHub Issues](https://github.com/Ryandabao1982/PPCPlanner/issues)

3. **Create new issue**:
   - Include error messages
   - Specify OS and Node version
   - List steps to reproduce

4. **Community support**:
   - Check discussions tab
   - Ask in relevant communities

---

## Next Steps

After successful installation:

1. **Explore the application**:
   - Navigate through all views
   - Try creating a campaign
   - Test the AI Report Generator

2. **Read documentation**:
   - [FEATURES.md](docs/FEATURES.md) - Feature guide
   - [ARCHITECTURE.md](docs/ARCHITECTURE.md) - Technical details
   - In-app Help & Docs (Ctrl/Cmd+H)

3. **Start planning**:
   - Create a workspace
   - Add campaigns and ad groups
   - Import keywords
   - Generate reports

4. **Customize**:
   - Configure environment variables
   - Set up your own branding (if forking)
   - Integrate with your workflow

---

## Uninstallation

To remove the application:

```bash
# Remove dependencies
rm -rf node_modules

# Remove build artifacts
rm -rf dist

# Remove the entire project
cd ..
rm -rf PPCPlanner
```

To remove global packages (if installed):
```bash
npm uninstall -g netlify-cli vercel
```

---

*Last Updated: October 22, 2024*
*Version: 0.0.0*
