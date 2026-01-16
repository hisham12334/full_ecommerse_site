# Google OAuth Setup Guide

This guide will help you set up Google OAuth sign-in for your e-commerce application.

## Prerequisites

- A Google account
- Access to Google Cloud Console

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "QadrFits E-commerce")
5. Click "Create"

## Step 2: Enable Google+ API

1. In your project, go to "APIs & Services" > "Library"
2. Search for "Google+ API"
3. Click on it and press "Enable"

## Step 3: Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (unless you have a Google Workspace)
3. Click "Create"
4. Fill in the required information:
   - App name: Your app name (e.g., "QadrFits")
   - User support email: Your email
   - Developer contact email: Your email
5. Click "Save and Continue"
6. Skip the "Scopes" section (click "Save and Continue")
7. Add test users if needed (for development)
8. Click "Save and Continue"

## Step 4: Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Enter a name (e.g., "QadrFits Web Client")
5. Add Authorized JavaScript origins:
   - For development: `http://localhost:5173`
   - For production: `https://yourdomain.com`
6. Add Authorized redirect URIs:
   - For development: `http://localhost:5173`
   - For production: `https://yourdomain.com`
7. Click "Create"
8. Copy the "Client ID" (you'll need this)

## Step 5: Configure Your Application

1. Open `full_ecommerse_site/.env`
2. Replace `your-google-client-id-here` with your actual Client ID:
   ```
   VITE_GOOGLE_CLIENT_ID=your-actual-client-id.apps.googleusercontent.com
   ```
3. Save the file

## Step 6: Test the Integration

1. Restart your development server if it's running
2. Navigate to the login page
3. You should see a "Sign in with Google" button
4. Click it and test the authentication flow

## Important Notes

- The Client ID is public and safe to include in your frontend code
- Never share your Client Secret (you don't need it for this implementation)
- For production, make sure to add your production domain to the authorized origins
- The database will automatically create a new user account when someone signs in with Google for the first time
- Users who sign up with Google will have a random password hash stored (they won't use it)

## Troubleshooting

### "Error: redirect_uri_mismatch"
- Make sure your authorized redirect URIs in Google Cloud Console match your application URL exactly
- Check for trailing slashes and http vs https

### Google button not showing
- Verify your Client ID is correctly set in the .env file
- Check browser console for errors
- Make sure you've restarted your dev server after changing .env

### "Access blocked: This app's request is invalid"
- Complete the OAuth consent screen configuration
- Add your email as a test user if the app is not published

## Security Best Practices

1. Keep your Client ID in environment variables
2. Never commit actual credentials to version control
3. Use different Client IDs for development and production
4. Regularly review authorized domains in Google Cloud Console
5. Monitor OAuth usage in Google Cloud Console

## Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [React OAuth Google Library](https://www.npmjs.com/package/@react-oauth/google)
