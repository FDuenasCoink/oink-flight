import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'
import { CompileData, TMetadata } from '../main/metadata.schema'

// Custom APIs for renderer
const api = {
  loadApp: (appLocation: string) => ipcRenderer.invoke('custom-loadApp', appLocation),
  closeApp: () => ipcRenderer.invoke('custom-closeApp'),
  getAppInfo: (path: string) => ipcRenderer.invoke('custom-getAppInfo', path),
  setVersion: (version: TMetadata) => ipcRenderer.invoke('custom-setVersion', version),
  getVersions: () => ipcRenderer.invoke('custom-getVersions'),
  removeVersion: (version: TMetadata) => ipcRenderer.invoke('custom-removeVersion', version),
  onAppStateChange: (callback) => {
    ipcRenderer.on('custom-events-appState', (_event, ...args) => {
      callback(...args)
    })
  },
  selectDirectory: () => ipcRenderer.invoke('custom-selectDirectory'),
  verifyProjectDir: (path: string) => ipcRenderer.invoke('custom-verifyProjectDir', path),
  compileVersion: (data: CompileData) => ipcRenderer.invoke('custom-compileVersion', data),
  getCompileData: () => ipcRenderer.invoke('custom-getCompileData')
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

contextBridge.exposeInMainWorld('SuperOinkElectron', {
  resetApp: () => ipcRenderer.invoke('superoink-resetApp'),
  getConfig: () => ipcRenderer.invoke('superoink-getConfig')
})
