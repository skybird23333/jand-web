import path from 'node:path'
import fs from 'node:fs'
import { response } from 'express'

export class RecursiveLimitError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'RecursiveLimitError'
    }
}

/**
 * Recursively check whether a path has an existing and writable parent directory
 * @param dir The path to check
 * @param recursiveCount For use in recursion only, you should not pass this in
 */
export default async function resursivelyCheckWritable(dir: string, recursiveCount?: number): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
        if(recursiveCount > 10) return reject(new RecursiveLimitError('Too many recursive calls at path ' + dir))
        const exists = fs.existsSync(dir)
        //does the given/current recursive path exist?
        if (!exists) {
            //if not, check the parent
            return resolve(resursivelyCheckWritable(path.join(dir, '..'), recursiveCount ? recursiveCount + 1 : 1))
        }
        fs.access(dir, fs.constants.W_OK, function (err) {
            if (err) {
                // Directory is not writable
                resolve(false)
            }
            //Directory is writable
            resolve(true)
        })
    })
}