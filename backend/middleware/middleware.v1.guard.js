/**
 * Slantapp code and properties {www.slantapp.io}
 */
import Async from './../core/core.async.js'
import {ModelAgent, ModelUser} from "../models/index.js";
import {ErrorClass, Utils} from "../core/index.js";
import { Op } from 'sequelize';
import { debugLog } from '../models/model.property.js';

export const MiddlewareApiGuard = Async(async (req, res, next) => {
    //do logic here
    try {
        const xToken = req.headers['guard-token']
        if (!xToken) return res.status(401).json(Utils.PrintRest("Unauthorized access", false, []))
        const isValid = await ModelUser.findOne({where: {token: xToken}})
        if (isValid) {
            req.user = isValid
            next()
        } else {
            return res.status(401).json(Utils.PrintRest("Unauthorized access", false, []))
        }
    } catch (e) {
        throw new ErrorClass(e.message, 400)
    }
})
export const MiddlewareAgentApiGuard = Async(async (req, res, next) => {
    //do logic here
    try {
        const xToken = req.headers['guard-token']
        if (!xToken) return res.status(401).json(Utils.PrintRest("Unauthorized access", false, []))
        const isValid = await ModelAgent.findOne({where: {token: xToken}})
        if (isValid) {
            req.agent = isValid
            next()
        } else {
            return res.status(401).json(Utils.PrintRest("Unauthorized access", false, []))
        }
    } catch (e) {
        throw new ErrorClass(e.message, 400)
    }
})
export const MiddlewareAgencyApiGuard = Async(async (req, res, next) => {
    //do logic here
    try {
        const xToken = req.headers['guard-token']
        if (!xToken) return res.status(401).json(Utils.PrintRest("Unauthorized access", false, []))
        const isValid = await ModelUser.findOne({where: {token: xToken}})
        if (isValid) {
            if (isValid.role === "business") {
                req.user = isValid
                next()
            } else res.status(401).json(Utils.PrintRest("Unauthorized access", false, []))
        } else {
            return res.status(401).json(Utils.PrintRest("Unauthorized access", false, []))
        }
    } catch (e) {
        throw new ErrorClass(e.message, 400)
    }
})

export const MiddlewareAgencyApiGuardMine = Async(async (req, res, next) => {
    try {
        debugLog('MiddlewareAgencyApiGuardMine entered', {
            headers: req.headers
        });
        
        const xToken = req.headers['guard-token'] || req.headers['authorization'];
        
        debugLog('Token extracted', { xToken });
        
        if (!xToken) {
            debugLog('No token found');
            return res.status(401).json(Utils.PrintRest("Unauthorized access", false, []));
        }
        
        const isValid = await ModelUser.findOne({
            where: { 
                [Op.or]: [
                    { token: xToken },
                    { apiKey: xToken }
                ],
                role: "business"
            },
            logging: console.log // Log the SQL query
        });
        
        debugLog('User lookup result', { userFound: !!isValid });
        
        if (!isValid) {
            debugLog('Invalid token or not business role');
            return res.status(401).json(Utils.PrintRest("Unauthorized access", false, []));
        }
        
        req.agency = isValid.get({ plain: true });
        debugLog('Authentication successful', { userId: req.agency.uid });
        next();
    } catch (e) {
        debugLog('Middleware error', { error: e.message });
        return res.status(500).json(Utils.PrintRest(e.message, false, []));
    }
});

// export const MiddlewareAgencyApiGuardMine = Async(async (req, res, next) => {
//     try {
//         const xToken = req.headers['guard-token'] || req.headers['authorization'];
//         if (!xToken) return res.status(401).json(Utils.PrintRest("Unauthorized access", false, []));
        
//         const isValid = await ModelUser.findOne({
//             where: { 
//                 [Op.or]: [
//                     { token: xToken },
//                     { apiKey: xToken }
//                 ],
//                 role: "business"
//             }
//         });
        
//         if (!isValid) {
//             return res.status(401).json(Utils.PrintRest("Unauthorized access", false, []));
//         }
        
//         req.agency = isValid.get({ plain: true });
//         next();
//     } catch (e) {
//         return res.status(500).json(Utils.PrintRest(e.message, false, []));
//     }
// });
