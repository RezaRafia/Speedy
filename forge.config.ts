import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { VitePlugin } from '@electron-forge/plugin-vite';
import path from 'path';

const config: ForgeConfig = {
  packagerConfig: {
    asar: true,
    icon: path.join(process.cwd(), 'main', 'build', 'icon'),
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        bin: 'Speedy'
      }
    },
    {
      name: '@electron-forge/maker-dmg',
      config: {
        bin: 'Speedy'
      },
    },
    {
      name: '@electron-forge/maker-deb',
      config: {
        bin: 'Speedy',
        options: {
          icon: path.join(process.cwd(), 'main', 'build', 'icon.png'),
        },
      }
    },
    {
      name: '@electron-forge/maker-rpm',
      config: {
        bin: 'Speedy',
        icon: path.join(process.cwd(), 'main', 'build', 'icon.png'),
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'RezaRafia',
          name: 'Speedy'
        },
        prerelease: true
      }
    }
  ]
};

export default config;
