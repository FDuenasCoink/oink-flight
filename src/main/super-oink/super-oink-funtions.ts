import { app, ipcMain } from 'electron'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Config } from './config.schema'

export function setupSuperOinkFuntions(): void {
  ipcMain.handle('superoink-resetApp', () => {
    app.relaunch()
    app.exit()
  })

  ipcMain.handle('superoink-getConfig', async () => {
    const desktopPath = app.getPath('desktop')
    const configPath = join(desktopPath, 'super_oink_config.json')
    const configString = await readFile(configPath, 'utf-8')
    const config = JSON.parse(configString)
    return Config.parseAsync(config)
  })
}
