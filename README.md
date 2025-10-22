<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1TuB3tHg6AxeRD0GFIXhBvKd_7PTegZlQ

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Features

### AI Plan Report Generator

Generate professional, AI-powered analysis reports of your PPC plans for brand presentations:

- **AI-Powered Insights**: Uses Gemini AI to analyze campaign structure, budget allocation, keyword strategy - optimized for brand executives
- **Concise & Impactful**: 2-3 sentence summaries and bullet points focused on business impact, not technical details
- **Executive Summary**: Get a clear overview of your PPC strategy and expected outcomes
- **Key Strengths & Opportunities**: Identify what's working and where to improve with business value clearly stated
- **Budget & Keyword Analysis**: Quick assessment of resource allocation and competitive positioning
- **Actionable Recommendations**: Specific, prioritized next steps with clear benefits
- **Infographic Export**: Download beautiful HTML reports perfect for client presentations

Access the AI Plan Report Generator from the Dashboard view. The generated reports include:
- Campaign and keyword statistics
- Visual metrics and KPIs
- Strategic analysis optimized for brand stakeholders
- Professional formatting suitable for executive presentations

**Note**: For production use, implement a backend service to secure API credentials. Current client-side implementation is for demonstration purposes.
