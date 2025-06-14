import React, { useState } from 'react';
import { Save, Upload, Download, RefreshCw } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { useNotification } from '../../contexts/NotificationContext';

export function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: 'CodeSwitch',
    siteDescription: 'Plateforme d\'apprentissage de programmation',
    maintenanceMode: false,
    registrationEnabled: true,
    emailNotifications: true,
    maxFileSize: 10,
    sessionTimeout: 30,
    backupFrequency: 'daily'
  });

  const { success, error } = useNotification();

  const handleSave = () => {
    // Ici on sauvegarderait les paramètres
    success('Paramètres sauvegardés avec succès');
  };

  const handleBackup = () => {
    success('Sauvegarde créée avec succès');
  };

  const handleRestore = () => {
    success('Système restauré avec succès');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Paramètres Système</h2>
        <Button icon={Save} onClick={handleSave}>
          Sauvegarder
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* General Settings */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Paramètres Généraux</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Nom du site
                </label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({...settings, siteName: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description du site
                </label>
                <textarea
                  value={settings.siteDescription}
                  onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                  rows={3}
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Mode maintenance</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Inscription activée</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.registrationEnabled}
                    onChange={(e) => setSettings({...settings, registrationEnabled: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Security Settings */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Sécurité</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Taille max des fichiers (MB)
                </label>
                <input
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => setSettings({...settings, maxFileSize: parseInt(e.target.value)})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Timeout de session (minutes)
                </label>
                <input
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({...settings, sessionTimeout: parseInt(e.target.value)})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-300">Notifications email</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailNotifications}
                    onChange={(e) => setSettings({...settings, emailNotifications: e.target.checked})}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                </label>
              </div>
            </div>
          </div>
        </Card>

        {/* Backup Settings */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Sauvegarde</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Fréquence de sauvegarde
                </label>
                <select
                  value={settings.backupFrequency}
                  onChange={(e) => setSettings({...settings, backupFrequency: e.target.value})}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:border-purple-500 focus:outline-none"
                >
                  <option value="hourly">Toutes les heures</option>
                  <option value="daily">Quotidienne</option>
                  <option value="weekly">Hebdomadaire</option>
                  <option value="monthly">Mensuelle</option>
                </select>
              </div>
              <div className="space-y-3">
                <Button
                  variant="outline"
                  icon={Download}
                  onClick={handleBackup}
                  className="w-full"
                >
                  Créer une sauvegarde
                </Button>
                <Button
                  variant="outline"
                  icon={Upload}
                  className="w-full"
                >
                  Restaurer une sauvegarde
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* System Info */}
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Informations Système</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-300">Version</span>
                <span className="text-white">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Base de données</span>
                <span className="text-green-400">Connectée</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Dernière sauvegarde</span>
                <span className="text-white">Il y a 2 heures</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-300">Espace disque</span>
                <span className="text-white">45.2 GB / 100 GB</span>
              </div>
              <Button
                variant="outline"
                icon={RefreshCw}
                onClick={handleRestore}
                className="w-full mt-4"
              >
                Redémarrer le système
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}