#!/bin/bash

echo "🏋️ Setting up FitnessMA Gym Management System..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js (version 16 or higher) first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "📦 Installing server dependencies..."
cd server && npm install && cd ..

echo ""
echo "📦 Installing client dependencies..."
cd client && npm install && cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "This will start:"
echo "  - Backend server on http://localhost:5000"
echo "  - Frontend client on http://localhost:3000"
echo ""
echo "Demo accounts:"
echo "  Admin: admin@fitnessma.com / admin123"
echo "  Coach: john.smith@fitnessma.com / coach123"
echo ""
echo "Happy coding! 💪" 