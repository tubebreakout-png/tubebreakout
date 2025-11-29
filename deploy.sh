#!/bin/bash

echo "🚀 Déploiement de TubeBreakout..."

# Build du projet
echo "📦 Build en cours..."
npm run build

# Configuration Git
cd dist
git init
git add -A
git commit -m "Deploy to GitHub Pages"

# Déploiement
echo "🌐 Push vers GitHub Pages..."
git push -f https://github.com/tubebreakout-png/tubebreakout.git main:gh-pages

cd ..
echo "✅ Déploiement terminé !"
echo "📍 Votre site sera disponible sur : https://tubebreakout-png.github.io/tubebreakout/"
