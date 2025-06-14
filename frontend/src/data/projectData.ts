export const mockProjectData = {
  id: '1',
  title: 'Site Portfolio Personnel',
  description: 'Construis un site portfolio responsive avec HTML et CSS',
  language: 'html',
  difficulty: 'beginner',
  xpReward: 100,
  estimatedTime: '2 heures',
  learningObjectives: [
    'Maîtriser les éléments sémantiques HTML5',
    'Apprendre CSS Grid et Flexbox',
    'Créer des designs responsives',
    'Implémenter des techniques CSS modernes'
  ],
  prerequisites: [
    'Connaissances de base en HTML',
    'Notions de CSS'
  ],
  lesson: `# Les bases du développement web moderne

## HTML sémantique
Le HTML sémantique consiste à utiliser des balises qui décrivent clairement leur contenu et leur fonction. Cela améliore l'accessibilité, le SEO et la maintenabilité du code.

### Éléments sémantiques importants
- \`<header>\`: En-tête de la page ou d'une section
- \`<nav>\`: Navigation principale
- \`<main>\`: Contenu principal
- \`<section>\`: Section thématique
- \`<article>\`: Contenu autonome
- \`<aside>\`: Contenu périphérique
- \`<footer>\`: Pied de page

## CSS moderne

### Flexbox
Flexbox est un modèle de mise en page unidimensionnel qui permet de disposer les éléments en ligne ou en colonne, et de distribuer l'espace entre les éléments d'une manière prévisible.

\`\`\`css
.container {
  display: flex;
  justify-content: space-between; /* Distribution horizontale */
  align-items: center; /* Alignement vertical */
}
\`\`\`

### CSS Grid
CSS Grid est un système de mise en page bidimensionnel qui permet de créer des grilles complexes avec un contrôle précis sur les lignes et les colonnes.

\`\`\`css
.grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 3 colonnes de largeur égale */
  gap: 20px; /* Espacement entre les éléments */
}
\`\`\`

### Media Queries
Les media queries permettent d'appliquer des styles différents selon les caractéristiques de l'appareil, comme la largeur de l'écran.

\`\`\`css
@media (max-width: 768px) {
  .grid {
    grid-template-columns: repeat(2, 1fr); /* 2 colonnes sur tablette */
  }
}

@media (max-width: 480px) {
  .grid {
    grid-template-columns: 1fr; /* 1 colonne sur mobile */
  }
}
\`\`\`

## Bonnes pratiques

1. **Mobile-first**: Commencer par concevoir pour les petits écrans, puis ajouter de la complexité pour les grands écrans
2. **Accessibilité**: Utiliser des attributs ARIA, des contrastes suffisants et une navigation au clavier
3. **Performance**: Optimiser les images, minimiser les requêtes HTTP et utiliser la mise en cache
4. **Maintenabilité**: Organiser le CSS avec une méthodologie comme BEM ou SMACSS`,
  instructions: `# Site Portfolio Personnel

## Objectif
Créer un site portfolio responsive qui présente vos compétences et projets.

## Instructions générales
1. Utilisez les éléments sémantiques HTML5 appropriés
2. Créez une structure avec header, main et footer
3. Ajoutez une section hero attractive
4. Créez une galerie de projets avec CSS Grid

## Structure HTML
Votre site doit inclure :
- Un header avec navigation
- Une section hero avec présentation
- Une section projets en grille
- Un footer avec informations de contact

## Styles CSS
- Utilisez CSS Grid et Flexbox pour la mise en page
- Créez un design responsive
- Ajoutez des effets d'interaction (hover, etc.)
- Utilisez des dégradés et ombres pour un design moderne

## Code de départ

\`\`\`html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
        }
    </style>
</head>
<body>
    <!-- Ajoute la navigation ici -->
    
    
    <!-- Ajoute le contenu principal ici -->
    
    
    <!-- Ajoute le footer ici -->
    
</body>
</html>
\`\`\`

## Critères de réussite
✅ Structure HTML sémantique et claire
✅ Navigation fonctionnelle
✅ Section hero visuellement attractive
✅ Galerie de projets en grille responsive
✅ Design responsive sur différentes tailles d'écran
✅ Effets d'interaction sur les éléments interactifs`,
  starterCode: `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mon Portfolio</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
        }
    </style>
</head>
<body>
    <!-- Ajoute la navigation ici -->
    
    
    <!-- Ajoute le contenu principal ici -->
    
    
    <!-- Ajoute le footer ici -->
    
</body>
</html>`,
  expectedOutput: 'Site portfolio responsive avec header, section hero et galerie de projets',
  hints: [
    'Utilisez <header>, <nav>, <main>, <section>, et <footer> pour la structure',
    'Appliquez CSS Grid pour la galerie de projets',
    'Utilisez Flexbox pour centrer et aligner les éléments',
    'Ajoutez des media queries pour la responsivité',
    'Utilisez des transitions CSS pour les effets hover'
  ]
};