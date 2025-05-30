const config = {
  API_URL: process.env.NODE_ENV === 'production' 
    ? 'https://fitnessma-backend.up.railway.app'
    : 'http://localhost:5001'
};

export default config; 