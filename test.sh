#!/usr/bin/env bash
set -euo pipefail

# Démarrage des services nécessaires
echo "▶️  Démarrage PostgreSQL (si pas déjà lancé)..."
brew services start postgresql@16 >/dev/null 2>&1 || true

echo "▶️  Démarrage Redis local..."
redis-server --port 6379 --save '' --appendonly no &
REDIS_PID=$!

# Stopper proprement à la fin
cleanup() {
  echo ""
  echo "🧹 Arrêt des services..."
  if kill -0 "$REDIS_PID" 2>/dev/null; then
    echo "  - Arrêt Redis (PID=$REDIS_PID)"
    kill "$REDIS_PID" 2>/dev/null || true
  fi
  echo "✅ Nettoyage terminé."
}
trap cleanup EXIT INT TERM

echo "▶️  Lancement de l'application (nx start)..."
npx nx start

