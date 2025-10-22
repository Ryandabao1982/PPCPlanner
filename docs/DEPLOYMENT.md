# Deployment Guide

This guide covers deployment options and best practices for the GoodWit PPC Planner application.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Process](#build-process)
- [Deployment Platforms](#deployment-platforms)
- [Environment Variables](#environment-variables)
- [Security Considerations](#security-considerations)
- [Performance Optimization](#performance-optimization)
- [Monitoring & Maintenance](#monitoring--maintenance)

## Prerequisites

Before deploying, ensure you have:

- ✅ Node.js >= 18.0.0 installed
- ✅ npm >= 9.0.0 installed
- ✅ Google Gemini API key
- ✅ Successful local build (`npm run build`)
- ✅ All tests passing (`npm test`)

## Build Process

### Development Build

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env.local

# Add your API key to .env.local
echo "GEMINI_API_KEY=your_key_here" > .env.local

# Run dev server
npm run dev
```

### Production Build

```bash
# Clean previous builds
rm -rf dist/

# Install dependencies
npm ci --production=false

# Build for production
npm run build

# Preview production build
npm run preview
```

The build output will be in the `dist/` directory.

## Deployment Platforms

### Vercel (Recommended)

Vercel provides optimal support for Vite projects with automatic deployments.

#### Setup

1. **Install Vercel CLI** (optional)
   ```bash
   npm install -g vercel
   ```

2. **Deploy via CLI**
   ```bash
   vercel
   ```

3. **Or connect via GitHub**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Configure project settings
   - Deploy

#### Configuration

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "framework": "vite",
  "env": {
    "GEMINI_API_KEY": "@gemini-api-key"
  }
}
```

Add environment variable in Vercel dashboard:
- Settings → Environment Variables
- Name: `GEMINI_API_KEY`
- Value: Your API key
- Environment: Production, Preview, Development

### Netlify

Netlify offers simple static hosting with continuous deployment.

#### Setup

1. **Deploy via CLI**
   ```bash
   npm install -g netlify-cli
   netlify deploy --prod
   ```

2. **Or deploy via Git**
   - Connect repository at [netlify.com](https://netlify.com)
   - Configure build settings
   - Deploy

#### Configuration

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Add environment variable in Netlify dashboard:
- Site settings → Environment variables
- Key: `GEMINI_API_KEY`
- Value: Your API key

### AWS S3 + CloudFront

For scalable, cost-effective static hosting.

#### Setup

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://your-bucket-name
   ```

2. **Configure bucket for static hosting**
   ```bash
   aws s3 website s3://your-bucket-name \
     --index-document index.html \
     --error-document index.html
   ```

3. **Build and upload**
   ```bash
   npm run build
   aws s3 sync dist/ s3://your-bucket-name
   ```

4. **Create CloudFront distribution**
   - Origin: Your S3 bucket
   - Default root object: index.html
   - Custom error responses: 404 → /index.html

#### Configuration

Set up IAM permissions and environment variables via AWS Secrets Manager or Parameter Store.

### GitHub Pages

Free hosting for public repositories.

#### Setup

1. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Update package.json**
   ```json
   {
     "scripts": {
       "deploy": "vite build && gh-pages -d dist"
     }
   }
   ```

3. **Configure vite.config.ts**
   ```typescript
   export default defineConfig({
     base: '/PPCPlanner/', // Your repo name
     // ... other config
   });
   ```

4. **Deploy**
   ```bash
   npm run deploy
   ```

#### Limitations
- Environment variables exposed in client-side code
- Not suitable for sensitive API keys
- Consider backend proxy for production

## Environment Variables

### Required Variables

```bash
# .env.local
GEMINI_API_KEY=your_google_gemini_api_key_here
```

### Platform-Specific Setup

**Vercel**
```bash
vercel env add GEMINI_API_KEY
```

**Netlify**
```bash
netlify env:set GEMINI_API_KEY your_key_here
```

**GitHub Actions**
- Repository Settings → Secrets → Actions
- Add `GEMINI_API_KEY`

### Environment Variable Best Practices

1. **Never commit API keys** to version control
2. **Use different keys** for dev/staging/production
3. **Rotate keys regularly** (at least every 90 days)
4. **Monitor API usage** in Google Cloud Console
5. **Set up rate limiting** to prevent abuse

## Security Considerations

### Current Setup (Development)

⚠️ **Warning**: The current implementation exposes the API key in client-side code. This is acceptable for development and personal use, but **not recommended for production**.

### Production Recommendations

#### Option 1: Backend Proxy Service

Create a backend API to proxy Gemini requests:

```
Client → Your Backend → Google Gemini API
```

**Benefits:**
- API key never exposed to client
- Rate limiting control
- Usage monitoring
- Additional validation

**Example Setup:**

```javascript
// backend/api/gemini.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const genAI = new GoogleGenAI({ 
      apiKey: process.env.GEMINI_API_KEY 
    });
    
    // Process request and call Gemini API
    const result = await genAI.models.generateContent(req.body);
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'API Error' });
  }
}
```

#### Option 2: Serverless Functions

Use platform-specific serverless functions:

**Vercel Functions:**
```javascript
// api/generate-keywords.js
export default async function (req, res) {
  // API logic here
}
```

**Netlify Functions:**
```javascript
// netlify/functions/generate-keywords.js
exports.handler = async (event) => {
  // API logic here
};
```

#### Option 3: Firebase/Supabase Backend

Integrate with Firebase or Supabase for full backend capabilities:
- Authentication
- Database
- API key management
- Rate limiting

### Additional Security Measures

1. **Content Security Policy (CSP)**
   ```html
   <meta http-equiv="Content-Security-Policy" 
         content="default-src 'self'; script-src 'self' 'unsafe-inline'">
   ```

2. **HTTPS Only**
   - Ensure all deployments use HTTPS
   - Most platforms enable this by default

3. **Rate Limiting**
   - Implement client-side request throttling
   - Use backend rate limiting

4. **Input Validation**
   - Validate all user inputs
   - Sanitize data before API calls

## Performance Optimization

### Build Optimization

1. **Code Splitting**
   ```typescript
   // vite.config.ts
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom'],
           gemini: ['@google/genai'],
           pdf: ['jspdf', 'jspdf-autotable']
         }
       }
     }
   }
   ```

2. **Compression**
   Most platforms handle this automatically, but you can enable gzip:
   ```bash
   # Build with compression
   vite build --mode production
   ```

3. **Asset Optimization**
   - Optimize images (use WebP format)
   - Minimize CSS
   - Tree-shake unused code

### Runtime Optimization

1. **CDN Configuration**
   - Cache static assets (JS, CSS, images)
   - Set appropriate cache headers

2. **Lazy Loading**
   - Load components on demand
   - Defer non-critical resources

3. **Service Worker** (optional)
   - Implement PWA features
   - Enable offline functionality

## Monitoring & Maintenance

### Monitoring Setup

1. **Vercel Analytics**
   ```bash
   npm install @vercel/analytics
   ```

2. **Google Analytics**
   ```html
   <!-- Add to index.html -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
   ```

3. **Error Tracking**
   - Sentry
   - LogRocket
   - Bugsnag

### Key Metrics to Monitor

- **Performance**
  - Page load time
  - Time to interactive
  - Core Web Vitals

- **API Usage**
  - Gemini API calls
  - Response times
  - Error rates

- **User Behavior**
  - Active users
  - Feature usage
  - Error frequency

### Maintenance Checklist

#### Daily
- [ ] Monitor API quota usage
- [ ] Check error logs
- [ ] Review user feedback

#### Weekly
- [ ] Update dependencies (security patches)
- [ ] Review performance metrics
- [ ] Backup critical data

#### Monthly
- [ ] Rotate API keys
- [ ] Review and update documentation
- [ ] Audit security practices
- [ ] Update CHANGELOG.md

#### Quarterly
- [ ] Major dependency updates
- [ ] Performance audit
- [ ] Security audit
- [ ] User feedback review

## Troubleshooting

### Common Deployment Issues

**Build Fails**
```bash
# Clear cache and rebuild
rm -rf node_modules dist
npm install
npm run build
```

**API Key Not Working**
- Verify key in platform settings
- Check key hasn't expired
- Ensure proper environment variable name
- Restart deployment

**404 Errors on Routes**
- Configure SPA fallback
- Add redirect rules
- Check base path configuration

**Slow Load Times**
- Enable compression
- Implement code splitting
- Use CDN for assets
- Optimize bundle size

## Rollback Procedure

If deployment fails:

1. **Immediate rollback** (Vercel/Netlify)
   - Use platform dashboard to rollback to previous deployment
   
2. **Manual rollback**
   ```bash
   git revert HEAD
   git push
   ```

3. **Hot fix deployment**
   ```bash
   git checkout production
   git cherry-pick <fix-commit>
   git push
   ```

## Post-Deployment Checklist

After deployment:

- [ ] Verify site is accessible
- [ ] Test AI features work
- [ ] Check all navigation links
- [ ] Verify environment variables
- [ ] Test on multiple browsers
- [ ] Check mobile responsiveness
- [ ] Verify analytics tracking
- [ ] Monitor error rates
- [ ] Check performance metrics
- [ ] Update documentation
- [ ] Notify team/users

## Support

For deployment issues:
- Check platform status pages
- Review platform documentation
- Open an issue on GitHub
- Contact platform support

---

**Last Updated**: October 2025
