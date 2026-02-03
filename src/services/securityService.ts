
interface SecurityEvent {
  event_type: string;
  event_details?: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
}

export class SecurityService {
  static async logSecurityEvent(event: SecurityEvent): Promise<void> {
    try {
      // Mock user for localStorage environment
      const user = { id: 'demo-admin-id' };

      // In localStorage environment, we log to console or a dedicated table
      console.log('Security Event (localStorage):', {
        user_id: user?.id || null,
        event_type: event.event_type,
        event_details: event.event_details || {},
        ip_address: event.ip_address,
        user_agent: event.user_agent || navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Failed to log security event:', error);
    }
  }

  static async logFailedLogin(email: string, error: string): Promise<void> {
    try {
      await this.logSecurityEvent({
        event_type: 'failed_login',
        event_details: {
          email,
          error,
          timestamp: new Date().toISOString()
        }
      });
    } catch (err) {
      console.error('Failed to log failed login:', err);
    }
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePassword(password: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static checkPasswordStrength(password: string): {
    score: number;
    label: string;
    color: string;
    feedback: string[];
  } {
    let score = 0;
    const feedback: string[] = [];

    // Length check
    if (password.length >= 8) {
      score++;
    } else {
      feedback.push('Use at least 8 characters');
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score++;
    } else {
      feedback.push('Add uppercase letters');
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score++;
    } else {
      feedback.push('Add lowercase letters');
    }

    // Number check
    if (/[0-9]/.test(password)) {
      score++;
    } else {
      feedback.push('Add numbers');
    }

    // Special character check
    if (/[^A-Za-z0-9]/.test(password)) {
      score++;
    } else {
      feedback.push('Add special characters');
    }

    // Determine strength label and color
    let label = '';
    let color = '';

    switch (score) {
      case 0:
      case 1:
        label = 'Very Weak';
        color = '#ff4444';
        break;
      case 2:
        label = 'Weak';
        color = '#ff8800';
        break;
      case 3:
        label = 'Fair';
        color = '#ffaa00';
        break;
      case 4:
        label = 'Good';
        color = '#88cc00';
        break;
      case 5:
        label = 'Strong';
        color = '#00aa00';
        break;
    }

    return {
      score,
      label,
      color,
      feedback
    };
  }

  static isCommonPassword(password: string): boolean {
    const commonPasswords = [
      'password', '123456', '123456789', 'qwerty', 'abc123',
      'password123', 'admin', 'letmein', 'welcome', 'monkey',
      '1234', '12345', '123123', 'qwerty123', 'password1'
    ];

    return commonPasswords.includes(password.toLowerCase());
  }

  static sanitizeInput(input: string): string {
    return input.trim().replace(/[<>]/g, '');
  }
}
