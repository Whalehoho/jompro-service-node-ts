import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Temporary storage for verification codes
const verificationCodes = new Map<string, { code: string; expiresAt: number }>();

// Generate a random 4-digit verification code
const generateCode = (): string => Math.floor(1000 + Math.random() * 9000).toString();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  service: 'gmail', // Change if using another provider (e.g., SMTP, SendGrid)
  auth: {
    user: process.env.EMAIL_USER, // Your email address
    pass: process.env.EMAIL_PASS, // App password (not your actual email password)
  },
});

/**
 * Send a verification email with a 4-digit code
 * @param email - Recipient email
 */
export const sendVerificationEmail = async (email: string) => {
  const code = generateCode(); // Generate the 4-digit code
  const expiresAt = Date.now() + 10 * 60 * 1000; // Code expires in 10 minutes

  // Store the code temporarily (You can replace this with a database)
  verificationCodes.set(email, { code, expiresAt });

  console.log('verificationCodes', verificationCodes);

  // Email content
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset Code',
    text: `Your password reset code is: ${code}. It will expire in 10 minutes.`,
  };

  // Send the email
  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: 'Verification code sent successfully' };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, message: 'Failed to send verification email' };
  }
};

/**
 * Verify the code entered by the user
 * @param email - User's email
 * @param code - 4-digit code entered by the user
 */
export const verifyCode = (email: string, code: string) => {
    try {
        const trimmedEmail = email.trim();
        const trimmedCode = code.trim();
        const storedCodeData = verificationCodes.get(trimmedEmail);

        // console.log('storedCodeData', storedCodeData);
        // console.log('code', trimmedCode);
        // console.log('email', trimmedEmail);
        // console.log('expiresAt', storedCodeData?.expiresAt);
        // console.log('Date.now()', Date.now());

        // Check if code exists
        if (!storedCodeData) {
            console.log('No verification code found for this email');
            return { success: false, message: 'No verification code found for this email' };
        }

        // Check if the code is expired
        if (Number(storedCodeData.expiresAt) < Date.now()) {
            console.log('Verification code expired');
            verificationCodes.delete(trimmedEmail);
            return { success: false, message: 'Verification code expired' };
        }


        // Compare codes safely
        if (storedCodeData.code.toString().trim() !== trimmedCode) {
            console.log('Invalid verification code');
            return { success: false, message: 'Invalid verification code' };
        }

        // If everything is correct, delete the code and return success
        verificationCodes.delete(trimmedEmail);
        return { success: true, message: 'Verification code is valid' };

    } catch (error) {
        console.error('Error verifying code:', error);
        return { success: false, message: 'Something went wrong. Please try again later.' };
    }
};

