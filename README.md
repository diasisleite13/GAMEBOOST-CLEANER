{
  "name": "gameboost-cleaner",
  "version": "2.0.0",
  "description": "GameBoost Cleaner para Windows",
  "main": "src/main.js",
  "scripts": {
    "start": "electron .",
    "dist": "electron-builder --win nsis"
  },
  "devDependencies": {
    "electron": "^34.0.0",
    "electron-builder": "^25.1.8"
  },
  "build": {
    "appId": "com.gameboost.cleaner",
    "productName": "GameBoost Cleaner",
    "directories": {
      "output": "dist"
    },
    "files": [
      "src/**/*",
      "package.json"
    ],
    "win": {
      "target": [
        "nsis"
      ],
      "artifactName": "GameBoost-Cleaner-Setup-${version}.${ext}"
    },
    "nsis": {
      "oneClick": false,
      "allowToChangeInstallationDirectory": true,
      "createDesktopShortcut": true,
      "createStartMenuShortcut": true
    }
  }
}
