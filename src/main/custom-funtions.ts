import { BrowserWindow, app, dialog, ipcMain } from 'electron'
import { loadURL as LoadUrl } from 'electron-serve'
import { join } from 'node:path'
import * as fs from 'node:fs'
import { promisify } from 'node:util'
import { exec as execFn } from 'node:child_process'
import { setupSuperOinkFuntions } from './super-oink/super-oink-funtions'
import { rimraf } from 'rimraf'
import windowStateKeeper from 'electron-window-state'
import AdmZip from 'adm-zip'
import settings from 'electron-settings'
import { CompileData, Metadata, MetadataList, TMetadata } from './metadata.schema'

export const superOinkDirectory = join(app.getPath('temp'), 'super-oink-test')

const exec = promisify(execFn)

async function getAppInfo(location: string) {
  const zip = new AdmZip(location)
  const entry = zip.getEntry('metadata.json')
  const www = zip.getEntry('www/')
  if (!entry || !www) throw new Error('Metadata not found')
  try {
    const metadata = JSON.parse(entry.getData().toString('utf8'))
    return Metadata.parseAsync({ ...metadata, location })
  } catch {
    throw new Error('Invalid metadata')
  }
}

async function loadAppFiles(location: string) {
  const zip = new AdmZip(location)
  const metadataEntry = zip.getEntry('metadata.json')
  const www = zip.getEntry('www/')
  if (!metadataEntry || !www) throw new Error('invalid file')
  const metadata = JSON.parse(metadataEntry.getData().toString('utf8'))
  await Metadata.parseAsync({ ...metadata, location })
  await rimraf(superOinkDirectory)
  zip.extractEntryTo(www.entryName, superOinkDirectory, true, true)
}

function verifyProjectDir(path: string) {
  const isDirectory = fs.lstatSync(path).isDirectory()
  if (!isDirectory) {
    throw new Error('No es un proyecto valido')
  }
  const packagePath = join(path, 'package.json')
  const packagePathExist = fs.existsSync(packagePath)
  if (!packagePathExist) {
    throw new Error('No es un proyecto valido')
  }
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'))
  const buildComand = packageJson?.scripts?.build
  if (!buildComand) {
    throw new Error('comando de build no encontrado')
  }
  const wwwFolder = join(path, 'www')
  const wwwExist = fs.existsSync(wwwFolder)
  if (!wwwExist) {
    throw new Error('No es un proyecto valido')
  }
  return true
}

interface Options {
  loadURL: LoadUrl
}

let appId: number
const SETTINGS_KEY = 'versions_list'
const COMPILE_DATA_KEY = 'compile_data'

// Expose functions.
export function setupCutomFuntions({ loadURL }: Options): void {
  setupSuperOinkFuntions()

  ipcMain.handle('custom-loadApp', async (_event, appLocation: string) => {
    await loadAppFiles(appLocation)
    const mainWindowState = windowStateKeeper({
      defaultWidth: 1280,
      defaultHeight: 828
    })
    const appWindow = new BrowserWindow({
      x: mainWindowState.x,
      y: mainWindowState.y,
      width: mainWindowState.width,
      height: mainWindowState.height,
      show: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, '../preload/index.js'),
        sandbox: false,
        nodeIntegration: true,
        contextIsolation: true
      }
    })
    appId = appWindow.id
    mainWindowState.manage(appWindow)
    appWindow.on('ready-to-show', () => {
      appWindow.show()
    })
    appWindow.webContents.openDevTools({ mode: 'undocked' })
    await loadURL(appWindow)
    const windows = BrowserWindow.getAllWindows()
    const mainWindow = windows.find((w) => w !== appWindow)
    if (!mainWindow) return
    mainWindow.webContents.send('custom-events-appState', { open: true })
    appWindow.addListener('close', () => {
      mainWindow.webContents.send('custom-events-appState', { open: false })
    })
    return
  })

  ipcMain.handle('custom-closeApp', async () => {
    const appWindow = BrowserWindow.fromId(appId)
    if (!appWindow) return
    try {
      appWindow.close()
    } catch {
      return
    }
  })

  ipcMain.handle('custom-getAppInfo', (_event, location: string) => {
    return getAppInfo(location)
  })

  ipcMain.handle('custom-setVersion', async (_event, metadata: TMetadata) => {
    const version = await settings.set([SETTINGS_KEY, metadata.version], metadata)
    return version
  })

  ipcMain.handle('custom-getVersions', async () => {
    const rawValue = await settings.get(SETTINGS_KEY)
    if (!rawValue) return []
    const metadataList = await MetadataList.parseAsync(rawValue)
    const versions: TMetadata[] = []
    for (const version of Object.keys(metadataList)) {
      try {
        const location = metadataList[version].location
        const metadata = await getAppInfo(location)
        versions.push(metadata)
      } catch {
        const v = metadataList[version].version
        await settings.unset([SETTINGS_KEY, v])
        continue
      }
    }
    return versions.sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  })

  ipcMain.handle('custom-removeVersion', (_event, metadata: TMetadata) => {
    return settings.unset([SETTINGS_KEY, metadata.version])
  })

  ipcMain.handle('custom-selectDirectory', async () => {
    const mainWindow = BrowserWindow.getAllWindows().find((w) => w.id !== appId)
    if (!mainWindow) {
      throw new Error('No se encuentra la ventana principal')
    }
    const result = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })
    return result
  })

  ipcMain.handle('custom-verifyProjectDir', async (_event, path: string) => {
    return verifyProjectDir(path)
  })

  ipcMain.handle('custom-compileVersion', async (_event, data: CompileData) => {
    const { name, version, notes, author, project } = data
    const createdAt = new Date().toISOString()
    const metadataJson = JSON.stringify({ name, createdAt, version, notes, author })
    const metadata = Buffer.from(metadataJson, 'utf-8')
    const zip = new AdmZip()

    const cwd = project
    await exec(`npm run build`, { cwd })

    zip.addFile('metadata.json', metadata)
    const wwwPath = join(project, 'www')
    zip.addFile('www/', Buffer.of())
    zip.addLocalFolder(wwwPath, '/www')
    const fileName = `${name.replace(/ /g, '_')}_${version.replace(/\./g, '_')}.oink`
    const saveFolder = join(app.getPath('desktop'), 'versions')
    const path = join(saveFolder, fileName)
    await zip.writeZipPromise(path)
    settings.set(COMPILE_DATA_KEY, { project, author, version })
    return { path }
  })

  ipcMain.handle('custom-getCompileData', () => {
    return settings.get(COMPILE_DATA_KEY)
  })
}
