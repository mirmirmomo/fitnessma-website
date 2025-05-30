const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://fitnessma-website-production.up.railway.app'
    : 'http://localhost:5001'
};

export default config; 