import React from "react";
import { Lock, Copy as CopyIcon, AlertTriangle } from "lucide-react";

interface EmailTemplateProps {
  firstName: string;
  OTP: string;
  expiryTime: string | Date | number;
}

export const EmailTemplate = ({
  firstName,
  OTP,
  expiryTime,
}: EmailTemplateProps) => {
  const formatTime = (time: string | Date | number): string => {
    if (time instanceof Date || typeof time === "number") {
      return new Date(time).toLocaleString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZoneName: "short",
      });
    }
    return time as string;
  };

  const formattedExpiryTime = formatTime(expiryTime);

  return (
    <div style={{
        backgroundColor: '#f7fafc',
        paddingTop: '48px',
        paddingBottom: '48px',
        paddingLeft: '16px',
        paddingRight: '16px',
        fontFamily: 'Inter, Arial, sans-serif',
        color: '#2d3748',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        width: '100%',
        boxSizing: 'border-box',
    }}>
      <div style={{
          maxWidth: '672px',
          width: '100%',
          margin: '0 auto',
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
          border: '1px solid #edf2f7',
          overflow: 'hidden',
          boxSizing: 'border-box',
      }}>
        <div style={{
            background: 'linear-gradient(to right, #4c51bf, #4299e1)',
            paddingTop: '24px',
            paddingBottom: '24px',
            paddingLeft: '32px',
            paddingRight: '32px',
            color: '#ffffff',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Lock size={28} style={{ marginRight: '12px' }} />
            <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>StreamX</h1>
          </div>
          <p style={{ fontSize: '14px', opacity: 0.9, marginTop: '4px', marginBottom: 0 }}>Secure Verification Code</p>
        </div>

        <div style={{
            paddingLeft: '32px',
            paddingRight: '32px',
            paddingTop: '40px',
            paddingBottom: '40px',
            boxSizing: 'border-box',
        }}>
          <p style={{ fontSize: '18px', fontWeight: '500', marginBottom: '16px', color: '#1a202c' }}>
            Hello <span style={{ fontWeight: '600', color: '#4c51bf' }}>{firstName}</span>,
          </p>
          <p style={{ fontSize: '16px', color: '#4a5568', marginBottom: '24px', lineHeight: '1.625' }}>
            Thank you for using StreamX. Please use the following{" "}
            <strong style={{ color: '#4c51bf' }}>One-Time Password (OTP)</strong> to complete your verification.
          </p>

          <div
            style={{
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              borderRadius: '8px',
              paddingTop: '28px',
              paddingBottom: '28px',
              paddingLeft: '24px',
              paddingRight: '24px',
              textAlign: 'center',
              marginBottom: '32px',
              boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
              boxSizing: 'border-box',
            }}
          >
            <p style={{ fontSize: '14px', color: '#3182ce', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', fontWeight: '600' }}>
              Your Verification Code
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '36px', fontFamily: 'monospace', fontWeight: '800', color: '#2a4365', letterSpacing: '0.075em' }}>
                {OTP}
              </span>
              <CopyIcon
                size={22}
                style={{ color: '#a0aec0' }}
              />
            </div>
          </div>

          <div style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              fontSize: '14px',
              paddingTop: '12px',
              paddingBottom: '12px',
              paddingLeft: '16px',
              paddingRight: '16px',
              borderRadius: '8px',
              color: '#c53030',
              marginBottom: '24px',
              display: 'flex',
              alignItems: 'center',
              boxSizing: 'border-box',
          }}>
            <AlertTriangle size={18} style={{ color: '#f56565', marginRight: '8px', flexShrink: 0 }} />
            This OTP is valid for a limited time and expires on{" "}
            <strong style={{ marginLeft: '4px' }}>{formattedExpiryTime}</strong>.
          </div>

          <div style={{
              borderTop: '1px solid #edf2f7',
              paddingTop: '24px',
              marginTop: '24px',
              boxSizing: 'border-box',
          }}>
            <h3 style={{ fontSize: '16px', fontWeight: 'bold', display: 'flex', alignItems: 'center', color: '#1a202c', marginBottom: '12px', margin: 0 }}>
              <AlertTriangle size={20} style={{ color: '#ed8936', marginRight: '8px', flexShrink: 0 }} />
              Important Security Information
            </h3>
            <p style={{ fontSize: '14px', color: '#4a5568', marginBottom: '12px', lineHeight: '1.625' }}>
              <strong style={{ color: '#dd6b20' }}>Never share this OTP with anyone.</strong> StreamX will{" "}
              <strong style={{ color: '#dd6b20' }}>never</strong> request this code via phone, email, or
              any other communication channel.
            </p>
            <p style={{ fontSize: '14px', color: '#4a5568', margin: 0 }}>
              If you did not initiate this request, please contact our support team immediately at{" "}
              <a
                href="mailto:support@streamx.com"
                style={{ color: '#4c51bf', textDecoration: 'underline', fontWeight: '500' }}
              >
                support@streamx.com
              </a>{" "}
              or secure your account by resetting your password.
            </p>
          </div>
        </div>

        <div style={{
            backgroundColor: '#f7fafc',
            borderTop: '1px solid #edf2f7',
            paddingTop: '24px',
            paddingBottom: '24px',
            paddingLeft: '32px',
            paddingRight: '32px',
            textAlign: 'center',
            fontSize: '14px',
            color: '#718096',
            borderBottomLeftRadius: '12px',
            borderBottomRightRadius: '12px',
            boxSizing: 'border-box',
        }}>
          <p style={{ marginBottom: '8px', margin: 0 }}>© {new Date().getFullYear()} StreamX, Inc. All rights reserved.</p>
          <p style={{ margin: 0 }}>
            <a href="https://www.streamx.com" style={{ color: '#4c51bf', textDecoration: 'underline' }}>
              streamx.com
            </a>{" "}
            &bull;{" "}
            <a href="https://www.streamx.com/privacy" style={{ color: '#4c51bf', textDecoration: 'underline' }}>
              Privacy Policy
            </a>{" "}
            &bull;{" "}
            <a href="https://www.streamx.com/terms" style={{ color: '#4c51bf', textDecoration: 'underline' }}>
              Terms of Service
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};