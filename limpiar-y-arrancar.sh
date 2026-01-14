#!/bin/bash

# Script para limpiar TODO y arrancar el servidor desde cero

cd /Users/jano/Documents/playbook-50k

echo "🛑 Deteniendo todos los procesos..."
pkill -9 -f "next" 2>/dev/null
pkill -9 -f "node.*3000" 2>/dev/null
pkill -9 -f "node.*3001" 2>/dev/null
sleep 2

echo "🔓 Liberando puertos..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1

echo "🧹 Limpiando caché..."
rm -rf .next node_modules/.prisma node_modules/.cache

echo "🔧 Regenerando Prisma Client..."
npx prisma generate

echo "🚀 Arrancando servidor..."
npm run dev
