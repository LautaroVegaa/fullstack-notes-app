setup.sh
bash
#!/bin/bash

# Exit script on any error
set -e

echo "🚀 Setting up the Notes App..."

# Store root path
ROOT_DIR=$(pwd)

# === FRONTEND SETUP ===
echo ""
echo "📦 Installing frontend dependencies..."
cd "$ROOT_DIR/frontend"
npm install

# === BACKEND SETUP ===
echo ""
echo "📦 Installing backend dependencies..."
cd "$ROOT_DIR/backend"
npm install

echo ""
echo "🔄 Generating Prisma client..."
npx prisma generate

echo ""
echo "🗃️ Running Prisma migrations..."
npx prisma migrate dev --name init

# === DONE ===
echo ""
echo "✅ Setup complete!"
echo ""
echo "👉 To start the backend:"
echo "   cd backend && npm run start"
echo ""
echo "👉 To start the frontend:"
echo "   cd frontend && npm run dev"
