# Email Tracking Project - README

## Project Overview

This project implements an email tracking system using Node.js, Express, MongoDB, and EJS. It captures user information, including IP address, device type, browser, and geolocation, when a user interacts with the email or clicks a link in it. The collected data is displayed on an admin page for analysis.

---

## Features

1. **Tracking User Interactions**: Tracks clicks on email links and logs user details.
2. **Admin Dashboard**: Displays tracked data, including:
   - IP address
   - Device type
   - Browser
   - Geolocation (country, city)
   - Timestamp
3. **Geolocation**: Retrieves location information based on the user's IP address using `geoip-lite`.
4. **Email Open Tracking**: Attempts to log when the email is opened using a tracking pixel.

---

## Technical Details

- **Backend**: 
  - Built with Node.js and Express.
  - MongoDB database for storing tracking information.
  - Uses `geoip-lite` for geolocation and `express-useragent` for user-agent parsing.
- **Frontend**:
  - EJS for rendering the admin dashboard.
- **Email**:
  - HTML email sent to recipients includes:
    - A clickable link for interaction tracking.
    - An invisible tracking pixel for email-open tracking.

---

## How It Works

### Backend API

- **Tracking Endpoint (`/api/track`)**:
  - Logs IP address, user agent, referrer, and geolocation data.
  - Can be triggered by:
    1. A user's click on a link in the email.
    2. An invisible tracking pixel (1x1 image).

- **Admin Results (`/api/admin/result`)**:
  - Displays all logged interactions in a web-based dashboard.

---

## Installation Instructions

1. **Clone the Repository**:
   ```bash
   git clone (https://github.com/aliladakhi/Email-Tracker.git)
   cd (Email-Tracker)
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Start MongoDB**:
   Ensure MongoDB is running on `localhost:27017`. Use Docker or a local installation.

4. **Run the Server**:
   ```bash
   node app.js
   ```

5. **Access the Application**:
   - Tracking endpoint: `http://localhost:3000/api/track`
   - Admin dashboard: `http://localhost:3000/api/admin/result`

---

## HTML Email Example

```html
<!DOCTYPE html>
<html>
<head>
  <style>
    a {
      color: #ffffff;
      background-color: #007BFF;
      text-decoration: none;
      padding: 10px 20px;
      border-radius: 5px;
      font-size: 16px;
    }
    .tracking-pixel {
      display: none;
    }
  </style>
</head>
<body>
  <h1>Special Offer Just for You!</h1>
  <p>Click the link below to claim your offer:</p>
  <img src="http://your-public-domain/api/track" alt="Tracking Pixel" width="1" height="1" class="tracking-pixel">
  <a href="http://your-public-domain/api/track" target="_blank">Claim Your Offer</a>
</body>
</html>
```

Replace `http://your-public-domain` with your server’s public domain or IP address.

---

## Challenges Encountered

### 1. **Tracking Pixel (`img src`) Issues**
   - **Problem**: Using `<img src="http://localhost:3000/api/track" />` in the email did not work because:
     - The server is only accessible locally and not on the public internet.
     - Many email clients block images by default or require user action to display them.
   - **Solution**: To make the tracking pixel effective:
     - Host the server on a public domain (e.g., using **Ngrok**, AWS, or any public hosting platform).
     - Use an accessible URL for the tracking pixel.

### 2. **Click Tracking with Links**
   - **Problem**: Direct tracking links (e.g., `http://localhost:3000/api/track`) exposed raw API endpoints.
   - **Solution**: Use a user-friendly link or URL shortener to mask the tracking endpoint.

### 3. **Email Client Behavior**
   - Many email clients strip inline scripts and dynamic content.
   - The email must rely on static elements (e.g., links, images) for interaction.

### 4. **Testing Environment**
   - Tracking works only when the server is publicly accessible. Testing locally required using a tool like **Ngrok**.

---

## Recommendations

- **Public Server**: Host the application on a platform accessible from the internet.
- **Security**: Sanitize inputs and validate requests to prevent malicious data entry.
- **Backup**: Regularly back up MongoDB data to avoid data loss.
- **Testing**: Test the email on different clients (Gmail, Outlook) to ensure compatibility.

---

## Future Improvements

1. Add authentication for the admin dashboard.
2. Enhance email design with responsive templates.
3. Log more detailed geolocation data (e.g., ISP information).
4. Use a reliable IP-to-location API for better accuracy.

---

Let me know if you need additional customization!