import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Code2, 
  Rocket, 
  Users, 
  Trophy, 
  ArrowRight,
  BookOpen,
  Zap,
  Star
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { LandingNavbar } from '../components/common/LandingNavbar';

export function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black">
      <LandingNavbar />
      
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold text-white mb-6"
            >
              Codez. Comprenez. Progressez.
              <br />
              Apprenez le développement web à travers des projets concrets
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
                {" "}en français.
              </span>
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto"
            >
              Maîtrisez le développement web avec des projets pratiques et une communauté active.
              Devenez un développeur professionnel à votre rythme.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link to="/register">
                <Button variant="primary" size="lg" className="w-full sm:w-auto">
                  Commencer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/projects">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Explorer les projets
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Pourquoi choisir CodeSwitch ?
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Une approche unique pour apprendre le développement web en français,
              avec des projets concrets et une communauté active.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: Code2,
                title: "Projets Pratiques",
                description: "Apprenez en construisant des projets réels et concrets"
              },
              {
                icon: Rocket,
                title: "Progression Rapide",
                description: "Un parcours d'apprentissage optimisé pour votre succès"
              },
              {
                icon: Users,
                title: "Communauté Active",
                description: "Échangez avec d'autres apprenants et développeurs"
              },
              {
                icon: Trophy,
                title: "Certifications",
                description: "Obtenez des certifications reconnues pour vos compétences"
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-800/50 p-6 rounded-xl border border-gray-700/50 hover:border-purple-500/50 transition-colors"
              >
                <feature.icon className="h-12 w-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Learning Path Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Votre parcours d'apprentissage
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Un parcours structuré pour maîtriser le développement web étape par étape
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BookOpen,
                title: "Fondamentaux",
                description: "HTML, CSS, JavaScript et les bases du développement web"
              },
              {
                icon: Zap,
                title: "Frameworks",
                description: "React, Node.js et les outils modernes du développement"
              },
              {
                icon: Star,
                title: "Projets Avancés",
                description: "Applications complètes et déploiement en production"
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative"
              >
                <div className="bg-gray-800/50 p-8 rounded-xl border border-gray-700/50">
                  <step.icon className="h-12 w-12 text-purple-500 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400">{step.description}</p>
                </div>
                {index < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-8 w-8 text-purple-500" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600/20 to-pink-600/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Prêt à commencer votre voyage ?
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'apprenants qui ont déjà commencé leur parcours
            vers une carrière en développement web.
          </p>
          <Link to="/register">
            <Button variant="primary" size="lg">
              Commencer maintenant
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4">CodeSwitch</h3>
              <p className="text-gray-400">
                Apprenez le développement web en français avec des projets pratiques.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Navigation</h4>
              <ul className="space-y-2">
                <li><Link to="/projects" className="text-gray-400 hover:text-white">Projets</Link></li>
                <li><Link to="/challenges" className="text-gray-400 hover:text-white">Défis</Link></li>
                <li><Link to="/community" className="text-gray-400 hover:text-white">Communauté</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Ressources</h4>
              <ul className="space-y-2">
                <li><Link to="/blog" className="text-gray-400 hover:text-white">Blog</Link></li>
                <li><Link to="/docs" className="text-gray-400 hover:text-white">Documentation</Link></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Légal</h4>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white">Confidentialité</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white">Conditions</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CodeSwitch. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  );
} 