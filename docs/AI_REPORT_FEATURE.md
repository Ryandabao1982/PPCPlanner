# AI Plan Report Generator - User Guide

## Overview

The AI Plan Report Generator is a powerful feature that creates professional, AI-powered analysis reports of your PPC plans. These reports are designed for brand presentations and stakeholder communications.

## Features

### 1. **AI-Powered Analysis**
- Uses Google Gemini AI to analyze your entire PPC plan
- Evaluates campaign structure, budget allocation, keyword strategy, and more
- Generates concise, brand-focused insights based on industry best practices
- Answers key questions brands care about: ROI, competitive advantages, growth opportunities

### 2. **Comprehensive Yet Concise Report Sections**

The generated report includes:

- **Executive Summary**: 2-3 sentence overview of strategy and expected business impact
- **Key Strengths**: 3-4 concise points highlighting competitive advantages
- **Growth Opportunities**: 3-4 actionable areas for improvement with clear business value
- **Budget Analysis**: Brief assessment of budget allocation effectiveness
- **Keyword Strategy**: Quick evaluation of coverage and competitive positioning
- **Campaign Structure**: Short review of organization quality
- **Recommendations**: 3-4 specific, prioritized next steps with clear benefits

### 3. **Beautiful Infographic Design**

- Gradient header with brand name
- Visual stat cards showing key metrics
- Color-coded sections with icons
- Professional formatting suitable for client presentations
- Print-friendly design

### 4. **Easy Export**

- One-click HTML export
- Self-contained file with embedded styles
- Can be viewed in any web browser
- Easy to share via email or presentation software

## How to Use

### Step 1: Navigate to Dashboard
1. Open your workspace in the PPC Planner
2. Click on "Dashboard" in the left sidebar
3. The AI Plan Report section appears below the Plan Overview

### Step 2: Generate Report
1. Click the "Generate AI Report" button
2. Wait for the AI to analyze your plan (typically 5-10 seconds)
3. The report will appear on screen with all sections populated

### Step 3: Review Report
- Scroll through the generated insights
- Review the AI's analysis of your strategy
- Note the recommendations for improvement

### Step 4: Export Report
1. Click "Export as HTML" button
2. The report downloads as an HTML file
3. Open the file in any web browser
4. Share with clients, stakeholders, or team members

### Step 5: Hide Report (Optional)
- Click "Hide Report" to return to the generation screen
- Your report remains in the workspace history

## Requirements

### API Key Setup
To use this feature, you need a Google Gemini API key:

1. Visit [Google AI Studio](https://ai.google.dev/)
2. Get your free API key
3. Add it to `.env.local` file:
   ```
   API_KEY=your_gemini_api_key_here
   ```

### Data Requirements
For best results, ensure your workspace has:
- At least 1 campaign
- At least 1 ad group
- Some keywords in the keyword bank
- Budget allocations set

## Tips for Best Results

1. **Complete Your Plan**: The more complete your PPC plan, the better the AI analysis
2. **Set Goals**: Add performance goals to get more targeted recommendations
3. **Review for Brand Relevance**: Ensure the insights align with your brand's priorities
4. **Focus on Impact**: The report emphasizes business outcomes over technical details
5. **Keep History**: The workspace maintains a history of generated reports for reference

## Report History

All generated reports are tracked in the workspace with:
- Timestamp of generation
- Plan snapshot at time of generation
- User who generated the report
- Logged in Activity Log

## Troubleshooting

### "Failed to generate report" error
- Ensure your API key is correctly set in `.env.local`
- Check your internet connection
- Verify you have an active Gemini API key

### Report looks incomplete
- Ensure your workspace has sufficient data
- Check that campaigns, ad groups, and keywords are properly configured

### Export doesn't work
- Check browser download settings
- Ensure pop-ups are not blocked
- Try a different browser if issues persist

## Privacy & Data

- All report generation happens client-side and through your own API key
- No data is stored on external servers (except Google's API processing)
- Reports are stored locally in your browser's localStorage
- Exported HTML files contain only the data you choose to export

**Security Note**: The current implementation uses a client-side API key for demonstration purposes. For production deployments, consider implementing a backend service to protect API credentials and prevent exposure in client-side code.

## Future Enhancements

Planned improvements include:
- PDF export option
- Custom branding options
- Report templates
- Scheduled report generation
- Email delivery integration

## Support

For questions or issues:
1. Check the main [README.md](../README.md)
2. Review the Help & Docs section in the app
3. Contact support through the repository issues

---

**Note**: This feature requires an active internet connection and a valid Google Gemini API key to function.
