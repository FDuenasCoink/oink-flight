import { ElectronAPI } from '@electron-toolkit/preload'
import { CompileData, TMetadata } from '../main/metadata.schema'

interface AppState {
  open: boolean
}

interface DefaultData {
  project?: string
  author?: string
  version?: string
}

declare global {
  interface Window {
    electron: ElectronAPI
    api: {
      loadApp: (appLocation: string) => Promise<string>
      closeApp: () => Promise<string>
      getAppInfo: (path: string) => Promise<TMetadata>
      onAppStateChange: (callback: (state: AppState) => void) => void
      setVersion: (version: TMetadata) => Promise<TMetadata>
      getVersions: () => Promise<TMetadata[]>
      removeVersion: (version: TMetadata) => Promise<TMetadata>
      selectDirectory: () => Promise<Electron.OpenDialogReturnValue>
      verifyProjectDir: (path: string) => Promise<boolean>
      compileVersion: (data: CompileData) => Promise<{ path: string }>
      getCompileData: () => Promise<DefaultData>
    }
  }
}
