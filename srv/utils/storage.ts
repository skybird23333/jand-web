import { existsSync, readFileSync, writeFileSync } from "fs";

export default new class Storage {
    storage: {
        [module: string]: any
    };
    constructor() {
        this.readStorageFile();
    }

    private readStorageFile() {
        if(existsSync("./storage.json")) {
            this.storage = JSON.parse(readFileSync("./storage.json").toString());
        } else {
            this.storage = {};
            writeFileSync("./storage.json", JSON.stringify(this.storage));
        }
    }

    private writeStorageFile() {
        writeFileSync("./storage.json", JSON.stringify(this.storage));
    }
    
    /**
     * 
     * @param module 
     * @param data 
     */
    replaceStorage(module: string, data: any) {
        this.storage[module] = data;
        this.writeStorageFile();
    }

    /**
     * Update the storage with only the given fields
     * @param module 
     * @param data 
     */
    setStorage(module: string, data: {[key: string]: any}) {
        this.storage[module] = Object.assign(this.storage[module] || {}, data);
        this.writeStorageFile();
    }

    getStorage(module: string) {
        if(!this.storage[module]) {
            this.storage[module] = {};
            this.writeStorageFile();
            return {}
        } else {
            return this.storage[module];
        }
    }
}