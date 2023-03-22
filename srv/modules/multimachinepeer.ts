import { Application, NextFunction, Request, Response, Router } from 'express'
import config from '../utils/configManager'
import { IJandWebProcess, IMultimachineHostConfig, IMultimachinePeerConfig } from '../typings/interfaces'
import { jandClient } from '../utils/jandClient'
import { createHash } from 'node:crypto'

/**
 * The MultiMachinePeer class solely exports functions and routes for communicating with other machines when set as a peer in Multimachine mode.
 */
export default new class MultiMachinePeer {
    config: IMultimachinePeerConfig
    constructor() {
        this.config = config.getConfigforModule<IMultimachinePeerConfig>('multimachinepeer')
        if (!this.config) {
            this.config = {
                enabled: false,
                tokenHash: ''
            }
            config.replaceConfigforModule('multimachinepeer', this.config)
        }
        if (!this.config.enabled) return
        this.peerAuthCheck = this.peerAuthCheck.bind(this)
        this.setupPeerRoutes = this.setupPeerRoutes.bind(this)
        console.log('[multimachinepeer] You are now in MultiMachine peer mode. Jand-web server will now only accept connections from the main machine.')
    }

    isMultiMachinePeer() {
        return this.config.enabled
    }

    verifyToken(token: string) {
        return createHash('sha256').update(token).digest('hex') === this.config.tokenHash;
    }


    //**This should be run  */
    peerAuthCheck(req: Request, res: Response, next: NextFunction) {
        req.app.get('/*', (req, res) => {
            if (!req.headers['authorization']) return res.status(401).send('Unauthorized')
            const token = req.headers['authorization'].split(' ')[1]
            if (!token || !this.verifyToken(token)) return res.status(401).send('Unauthorized')
        })
        next()
    }

    setupPeerRoutes(app: Router) {
        if (!this.isMultiMachinePeer()) return
        app.get('/multimachine/connection-test', (req, res) => {
            if (!req.headers['authorization']) return res.status(401).send('Unauthorized')
            const token = req.headers['authorization'].split(' ')[1]
            if (!token || !this.verifyToken(token)) return res.status(401).send('Unauthorized')
            res.status(200).send({ success: true })
        })
        app.get('/multimachine/process-events', (req, res) => {
            if (!req.headers['authorization']) return res.status(401).send('Unauthorized')
            const token = req.headers['authorization'].split(' ')[1]
            if (!token || !this.verifyToken(token)) return res.status(401).send('Unauthorized')
        })
    }
}