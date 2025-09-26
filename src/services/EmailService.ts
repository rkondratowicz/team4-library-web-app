/**
 * EmailService - Handles email notifications and communications
 * This is part of the Business Logic Layer in our three-tier architecture
 * 
 * Note: This is a mock implementation for the member registration workflow.
 * In a production environment, you would integrate with an email service
 * provider like SendGrid, Amazon SES, or similar services.
 */

export interface WelcomeEmailData {
    memberName: string;
    memberEmail: string;
    memberRole: string;
    registrationDate: Date;
}

export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

export class EmailService {
    private isEnabled: boolean;
    private fromEmail: string;
    private fromName: string;

    constructor() {
        // In production, these would come from environment variables
        this.isEnabled = process.env.EMAIL_ENABLED === 'true' || false;
        this.fromEmail = process.env.EMAIL_FROM || 'noreply@library.com';
        this.fromName = process.env.EMAIL_FROM_NAME || 'Library Management System';
    }

    /**
     * Send welcome email to new member
     */
    async sendWelcomeEmail(emailData: WelcomeEmailData): Promise<EmailResult> {
        try {
            // Mock implementation - in production, integrate with actual email service
            if (!this.isEnabled) {
                console.log('📧 Email service disabled - Welcome email for:', emailData.memberEmail);
                return {
                    success: true,
                    messageId: 'mock-' + Date.now()
                };
            }

            const emailContent = this.generateWelcomeEmailContent(emailData);

            // This is where you would integrate with your email service provider
            console.log('📧 Sending welcome email to:', emailData.memberEmail);
            console.log('Email content:', emailContent);

            // Mock successful email sending
            const messageId = 'msg_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

            return {
                success: true,
                messageId: messageId
            };

        } catch (error) {
            console.error('Error sending welcome email:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Unknown email error'
            };
        }
    }

    /**
     * Generate welcome email content
     */
    private generateWelcomeEmailContent(emailData: WelcomeEmailData): { subject: string; html: string; text: string } {
        const { memberName, memberRole } = emailData;

        const subject = `Welcome to the Library Management System!`;

        const html = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Welcome to the Library</title>
                <style>
                    body { font-family: 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                    .content { background: #f8f9fa; padding: 30px; }
                    .features { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
                    .feature-list { list-style: none; padding: 0; }
                    .feature-list li { padding: 8px 0; border-bottom: 1px solid #eee; }
                    .feature-list li:before { content: "✓"; color: #2f855a; font-weight: bold; margin-right: 10px; }
                    .cta { background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
                    .footer { background: #333; color: white; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 14px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>📚 Welcome to the Library!</h1>
                    <p>Your account has been successfully created</p>
                </div>
                
                <div class="content">
                    <h2>Hello ${memberName}!</h2>
                    
                    <p>We're excited to welcome you to our Library Management System. Your ${memberRole} account is now active and ready to use!</p>
                    
                    <div class="features">
                        <h3>🎯 What you can do:</h3>
                        <ul class="feature-list">
                            <li>Browse our complete book catalog</li>
                            <li>Borrow up to 3 books at a time</li>
                            <li>Track your borrowed books and due dates</li>
                            <li>Return books with one-click convenience</li>
                            <li>Manage your profile and preferences</li>
                        </ul>
                    </div>
                    
                    <p>Ready to start exploring? Click the button below to log in to your account:</p>
                    
                    <a href="${process.env.BASE_URL || 'http://localhost:3000'}/login" class="cta">🚀 Get Started</a>
                    
                    <p><strong>Getting Help:</strong><br>
                    If you have any questions or need assistance, please don't hesitate to reach out to our library staff.</p>
                    
                    <p>Happy reading!<br>
                    <strong>The Library Team</strong></p>
                </div>
                
                <div class="footer">
                    <p>This email was sent because you created an account on our Library Management System.</p>
                    <p>If you didn't create this account, please contact us immediately.</p>
                </div>
            </body>
            </html>
        `;

        const text = `
Welcome to the Library Management System!

Hello ${memberName}!

We're excited to welcome you to our Library Management System. Your ${memberRole} account is now active and ready to use!

What you can do:
• Browse our complete book catalog
• Borrow up to 3 books at a time
• Track your borrowed books and due dates
• Return books with one-click convenience
• Manage your profile and preferences

Ready to start exploring? Visit ${process.env.BASE_URL || 'http://localhost:3000'}/login to log in to your account.

Getting Help:
If you have any questions or need assistance, please don't hesitate to reach out to our library staff.

Happy reading!
The Library Team

---
This email was sent because you created an account on our Library Management System.
If you didn't create this account, please contact us immediately.
        `;

        return { subject, html, text };
    }

    /**
     * Send password reset email (future feature)
     */
    async sendPasswordResetEmail(email: string, resetToken: string): Promise<EmailResult> {
        // Implementation for password reset emails
        console.log('📧 Password reset email would be sent to:', email, 'with token:', resetToken);

        return {
            success: true,
            messageId: 'reset_' + Date.now()
        };
    }

    /**
     * Send overdue book notification (future feature)
     */
    async sendOverdueNotification(memberEmail: string, overdueBooks: any[]): Promise<EmailResult> {
        // Implementation for overdue book notifications
        console.log('📧 Overdue notification would be sent to:', memberEmail, 'for books:', overdueBooks.length);

        return {
            success: true,
            messageId: 'overdue_' + Date.now()
        };
    }

    /**
     * Test email configuration
     */
    async testEmailService(): Promise<EmailResult> {
        try {
            console.log('🔧 Testing email service configuration...');
            console.log('Email enabled:', this.isEnabled);
            console.log('From email:', this.fromEmail);
            console.log('From name:', this.fromName);

            return {
                success: true,
                messageId: 'test_successful'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Test failed'
            };
        }
    }
}