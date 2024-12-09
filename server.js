const express = require('express');
const mongoose = require('mongoose');
const useragent = require('express-useragent');
const geoip = require('geoip-lite');
const path = require('path');

const app = express();
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(useragent.express());
const TrackSchema = new mongoose.Schema({
  ipAddress: String,
  userAgent: String,
  device: String,
  browser: String,
  platform: String,
  referrer: String,
  timestamp: { type: Date, default: Date.now },
  geo: {
    country: String,
    region: String,
    city: String,
    latitude: Number,
    longitude: Number,
    timezone: String,
    isp: String
  }
});

const Track = mongoose.model('Track', TrackSchema);

app.get('/api/track', async (req, res) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const geo = geoip.lookup(ip);

    const trackData = {
      ipAddress: ip,
      userAgent: req.headers['user-agent'],
      device: req.useragent.isMobile ? 'Mobile' : 
              req.useragent.isTablet ? 'Tablet' : 'Desktop',
      browser: req.useragent.browser,
      platform: req.useragent.platform,
      referrer: req.headers.referer || 'Direct',
      geo: {
        country: geo?.country || 'Unknown',
        region: geo?.region || 'Unknown',
        city: geo?.city || 'Unknown',
        latitude: geo?.ll?.[0],
        longitude: geo?.ll?.[1],
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        isp: 'Unknown'
      }
    };

    const trackRecord = new Track(trackData);
    await trackRecord.save();

    res.status(200)
    res.end();
  } catch (error) {
    console.error('Tracking error:', error);
    res.status(500).json({ error: 'Tracking failed' });
  }
});

app.get('/api/admin/result', async (req, res) => {
    try {
      const results = await Track.find({}).sort({ timestamp: -1 });
      console.log('Tracking Results:', JSON.stringify(results, null, 2));
  
      res.render('results', { 
        tracks: results.map(track => ({
          ...track.toObject(),
          country: track.geo?.country || 'Unknown',
          city: track.geo?.city || 'Unknown'
        }))
      });
    } catch (error) {
      console.error('Results retrieval error:', error);
      res.status(500).send('Could not retrieve tracking data');
    }
  });

mongoose.connect('mongodb://127.0.0.1:27017/email_tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const PORT =3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;