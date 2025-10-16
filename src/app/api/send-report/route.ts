import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { email, score, percentage, maxScore, answers } = await request.json();

    // Determine tier
    const getTier = (percentage: number) => {
      if (percentage >= 86) return { label: "Excellent", color: "#10b981" };
      if (percentage >= 66) return { label: "Performing", color: "#3b82f6" };
      if (percentage >= 41) return { label: "Developing", color: "#f59e0b" };
      return { label: "Needs Attention", color: "#ef4444" };
    };

    const tier = getTier(percentage);

    const htmlReport = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Business Health Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      line-height: 1.6;
      color: #374151;
      margin: 0;
      padding: 0;
      background-color: #f9fafb;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: white;
      padding: 40px;
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      border-bottom: 1px solid #e5e7eb;
      padding-bottom: 30px;
    }
    .score-display {
      text-align: center;
      margin: 40px 0;
    }
    .score-number {
      font-size: 72px;
      font-weight: 100;
      color: #1f2937;
      line-height: 1;
      margin-bottom: 10px;
    }
    .score-label {
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 2px;
      color: #6b7280;
      margin-bottom: 20px;
    }
    .tier-badge {
      display: inline-block;
      padding: 8px 20px;
      border-radius: 20px;
      font-weight: 500;
      color: white;
      background-color: ${tier.color};
    }
    .progress-bar {
      width: 100%;
      height: 8px;
      background-color: #e5e7eb;
      border-radius: 4px;
      margin: 30px 0;
      overflow: hidden;
    }
    .progress-fill {
      height: 100%;
      background-color: ${tier.color};
      width: ${percentage}%;
      border-radius: 4px;
    }
    .summary {
      background-color: #f9fafb;
      padding: 20px;
      border-radius: 8px;
      margin: 30px 0;
    }
    .summary h3 {
      margin-top: 0;
      color: #1f2937;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
    }
    .recommendations {
      margin: 30px 0;
    }
    .recommendation {
      background-color: #f0f9ff;
      border-left: 4px solid #3b82f6;
      padding: 15px 20px;
      margin: 15px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0; color: #1f2937; font-weight: 300;">Business Health Report</h1>
      <p style="margin: 10px 0 0 0; color: #6b7280;">Your comprehensive assessment results</p>
    </div>

    <div class="score-display">
      <div class="score-number">${percentage}</div>
      <div class="score-label">Business Health Score</div>
      <div class="tier-badge">${tier.label}</div>
    </div>

    <div class="progress-bar">
      <div class="progress-fill"></div>
    </div>

    <div class="summary">
      <h3>Assessment Summary</h3>
      <p><strong>Total Score:</strong> ${score} out of ${maxScore} points</p>
      <p><strong>Questions Completed:</strong> ${answers?.length || 5}</p>
      <p><strong>Performance Level:</strong> ${tier.label}</p>
    </div>

    <div class="recommendations">
      <h3 style="color: #1f2937;">Next Steps</h3>
      ${percentage >= 86 ? `
        <div class="recommendation">
          <strong>Maintain Excellence:</strong> Continue your current practices and consider mentoring other businesses.
        </div>
        <div class="recommendation">
          <strong>Innovation Focus:</strong> Explore new technologies and market opportunities to stay ahead.
        </div>
      ` : percentage >= 66 ? `
        <div class="recommendation">
          <strong>Optimize Operations:</strong> Look for process improvements and automation opportunities.
        </div>
        <div class="recommendation">
          <strong>Strategic Planning:</strong> Develop long-term growth strategies and KPI tracking.
        </div>
      ` : percentage >= 41 ? `
        <div class="recommendation">
          <strong>System Implementation:</strong> Invest in proper CRM and financial management systems.
        </div>
        <div class="recommendation">
          <strong>Process Documentation:</strong> Create standard operating procedures for key business functions.
        </div>
      ` : `
        <div class="recommendation">
          <strong>Foundation Building:</strong> Focus on establishing basic business systems and processes.
        </div>
        <div class="recommendation">
          <strong>Professional Guidance:</strong> Consider working with a business consultant or mentor.
        </div>
      `}
    </div>

    <div class="footer">
      <p>This report was generated based on your responses to our business health assessment.</p>
      <p>For more detailed guidance, consider scheduling a consultation with our team.</p>
    </div>
  </div>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      from: 'Business Health Check <onboarding@resend.dev>',
      to: [email],
      subject: `Your Business Health Report - ${percentage}% Score`,
      html: htmlReport,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}