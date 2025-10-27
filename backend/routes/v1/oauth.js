/**
 * Slantapp code and properties {www.slantapp.io}
 */
import express from 'express';
//libraries
import {
    AgentFacebookCallback, AgentFacebookGetUser,
    AgentFacebookLogin,
    AgentGoogleCallback, AgentGoogleGetUser,
    AgentGoogleLogin,
    FacebookCallback, FacebookGetUser,
    FacebookLogin,
    GoogleCallback,
    GoogleGetUser,
    GoogleLogin
} from "../../controllers/controller.v1.oauth2.js";

let router = express.Router();

/* GET users listing. */

//Google OAuth
router.get('/google/login', GoogleLogin)

router.get('/google/callback', GoogleCallback)

router.get('/google/user', GoogleGetUser)

//Facebook OAuth
router.get('/facebook/login', FacebookLogin)

router.get('/facebook/callback', FacebookCallback)

router.get('/facebook/user', FacebookGetUser)


/**
 * ********* Agents OAuthentication
 */

//Google OAuth
router.get('/agent/google/login/:code?', AgentGoogleLogin)

router.get('/agent/google/callback', AgentGoogleCallback)

router.get('/agent/google/user', AgentGoogleGetUser)

//Facebook OAuth
router.get('/agent/facebook/login/:code?', AgentFacebookLogin)

router.get('/agent/facebook/callback', AgentFacebookCallback)

router.get('/agent/facebook/user', AgentFacebookGetUser)

export default router
