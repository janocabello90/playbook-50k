#!/bin/bash

# Script rápido para liberar el puerto 3000

echo "🛑 Deteniendo procesos en puerto 3000..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
pkill -9 -f "next dev" 2>/dev/null
sleep 2

echo "✅ Puerto liberado. Ahora puedes ejecutar: npm run dev"
