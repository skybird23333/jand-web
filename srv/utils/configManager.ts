import { IConfig } from "../typings/interfaces"
import storage from "./storage"

export default new class ConfigManager {
    config: {
        [key: string]: IConfig
    }

    constructor() {
        this.config = storage.getStorage('config')
    }

    loadModulesByConfig() {
        for (const module in this.config) {
            if (this.config[module].enabled) {
                require(`./modules/${module}`)
                console.log(`Loaded module ${module}`)
            }
        }
    }

    getConfigforModule<T>(module: string) {
        return this.config[module] as T | null
    }

    replaceConfigforModule(module: string, config: IConfig) {
        this.config[module] = config
        storage.setStorage('config', this.config)
    }

    updateConfigforModule(module: string, config: Partial<IConfig>) {
        this.config[module] = Object.assign(this.config[module], config)
        storage.setStorage('config', this.config)
    }
}