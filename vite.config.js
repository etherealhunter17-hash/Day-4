import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'
import { defineConfig } from 'vite'

const naturePhotos = [
  'photo-1470770841072-f978cf4d019e',
  'photo-1500530855697-b586d89ba3ee',
  'photo-1470252649378-9c29740c9fa8',
  'photo-1501785888041-af3ef285b470',
  'photo-1441974231531-c6227db76b6e',
  'photo-1511497584788-876760111969',
  'photo-1472396961693-142e6e269027',
  'photo-1464822759023-fed622ff2c3b',
  'photo-1469474968028-56623f02e42e',
  'photo-1470071459604-3b5ec3a7fe05',
  'photo-1500534623283-312aade485b7',
  'photo-1500534314209-a25ddb2bd429',
  'photo-1473116763249-2faaef81ccda',
  'photo-1439853949127-fa647821eba0',
  'photo-1448375240586-882707db888b',
]

const cityPhotos = [
  'photo-1519501025264-65ba15a82390',
  'photo-1519608487953-e999c86e7455',
  'photo-1511818966892-d7d671e672a2',
  'photo-1514565131-fce0801e5785',
  'photo-1480714378408-67cf0d13bc1b',
  'photo-1518005020951-eccb494ad742',
  'photo-1449824913935-59a10b8d2000',
  'photo-1494522358652-f30e61a60313',
  'photo-1486406146926-c627a92ad1ab',
  'photo-1513635269975-59663e0ac1ad',
  'photo-1497366754035-f200968a6e72',
  'photo-1487958449943-2429e8be8625',
  'photo-1545324418-cc1a3fa10c00',
  'photo-1503387762-592deb58ef4e',
  'photo-1533105079780-92b9be482077',
]

const photos = [
  ...naturePhotos.map((imageId, index) => ({
    id: `nature-${index + 1}`,
    category: 'Nature',
    url: `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=900&q=85`,
  })),
  ...cityPhotos.map((imageId, index) => ({
    id: `city-${index + 1}`,
    category: 'City',
    url: `https://images.unsplash.com/${imageId}?auto=format&fit=crop&w=900&q=85`,
  })),
]

function localApi() {
  return {
    name: 'local-photos-api',
    configureServer(server) {
      server.middlewares.use((request, response, next) => {
        const path = request.url?.split('?')[0]
        if (path !== '/api/photos') {
          next()
          return
        }

        if (request.method !== 'GET') {
          response.statusCode = 405
          response.setHeader('Allow', 'GET')
          response.end()
          return
        }

        response.statusCode = 200
        response.setHeader('Content-Type', 'application/json; charset=utf-8')
        response.end(JSON.stringify(photos))
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    localApi(),
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})
