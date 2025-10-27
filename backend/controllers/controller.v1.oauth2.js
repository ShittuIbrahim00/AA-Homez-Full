/**
 * Slantapp code and properties {www.slantapp.io}
 */
import Async from './../core/core.async.js'
import {
    FacebookOAuthGetAccessToken,
    FacebookOAuthLogin, FacebookOAuthUserData,
    GoogleOAuthCallback,
    GoogleOAuthLogin,
    GoogleOAuthUser
} from "../core/core.OAuth.js";
import {ErrorClass, Utils} from "../core/index.js";
import {ModelAgent, ModelUser} from "../models/index.js";

//************** Google OAuth ***************//
export const GoogleLogin = Async(async (req, res, next) => {
    //do logic here
    try {
        res.redirect(GoogleOAuthLogin())
    } catch (e) {
        console.log(e)
        throw new ErrorClass(e.message, 500)
    }
})
export const GoogleCallback = Async(async (req, res, next) => {
    try {
        const {code} = req.query

        const result = await GoogleOAuthCallback(code)

        req.session.accessToken = result.accessToken
        req.session.idToken = result.idToken
        res.redirect('/api/v1/oauth/google/user')
    } catch (e) {
        console.log(e)
        throw new ErrorClass(e.message, 500)
    }
})
export const GoogleGetUser = Async(async (req, res, next) => {
    try {
        const accessToken = req.session.accessToken
        const idToken = req.session.idToken
        const result = await GoogleOAuthUser(accessToken, idToken);
        const userObj = {
            email: result.email,
            verified: result.verified_email,
            firstName: result.given_name,
            lastName: result.family_name,
            imgUrl: result.picture,
            password: result.id
        }
        const {user, created} = await ModelUser.OAuth(userObj)
        res.json(Utils.PrintRest("API Running - Ok", true, {user, created}))
    } catch (e) {
        console.log(e)
        throw new ErrorClass(e.message, 500)
    }
})


//************** Facebook OAuth ***************//
export const FacebookLogin = Async(async (req, res, next) => {
    try {
        res.redirect(FacebookOAuthLogin())

    } catch (e) {
        throw new ErrorClass(e.message, 500)
    }
})
export const FacebookCallback = Async(async (req, res, next) => {
    try {
        const {code} = req.query
        req.session.accessToken = await FacebookOAuthGetAccessToken(code)
        res.redirect('/api/v1/oauth/facebook/user')
    } catch (e) {
        throw new ErrorClass(e.message, 500)
    }
})
export const FacebookGetUser = Async(async (req, res, next) => {
    try {
        const accessToken = req.session.accessToken
        const result = await FacebookOAuthUserData(accessToken);
        const userObj = {
            email: result.email,
            verified: true,
            firstName: result.first_name,
            lastName: result.last_name,
            imgUrl: result.picture.data.url,
            password: result.id
        }
        const {user, created} = await ModelUser.OAuth(userObj)
        res.json(Utils.PrintRest("API Running - Ok", true, {user, created}))
    } catch (e) {
        console.log(e)
        throw new ErrorClass(e.message, 500)
    }
})


/**
 * ********* Agents OAuthentication
 */

//************** Google OAuth ***************//
export const AgentGoogleLogin = Async(async (req, res, next) => {
    //do logic here
    const {code} = req.params
    try {
        res.redirect(GoogleOAuthLogin(code))
    } catch (e) {
        console.log(e)
        throw new ErrorClass(e.message, 500)
    }
})
export const AgentGoogleCallback = Async(async (req, res, next) => {
    try {
        const {code, state} = req.query
        const result = await GoogleOAuthCallback(code)
        req.session.accessToken = result.accessToken
        req.session.idToken = result.idToken
        req.session.code = state
        res.redirect('/api/v1/oauth/agent/google/user')
    } catch (e) {
        console.log(e)
        throw new ErrorClass(e.message, 500)
    }
})
export const AgentGoogleGetUser = Async(async (req, res, next) => {
    try {
        const accessToken = req.session.accessToken
        const idToken = req.session.idToken
        const code = req.session.code !== "undefined" ? req.session.code : null

        const result = await GoogleOAuthUser(accessToken, idToken);
        const userObj = {
            email: result.email,
            verified: result.verified_email,
            fullName: result.family_name + " " + result.given_name,
            imgUrl: result.picture,
            password: result.id,
            code
        }
        const {user, created} = await ModelAgent.OAuth(userObj)
        res.json(Utils.PrintRest("API Running - Ok", true, {user, created}))
    } catch (e) {
        console.log(e)
        throw new ErrorClass(e.message, 500)
    }
})


//************** Facebook OAuth ***************//
export const AgentFacebookLogin = Async(async (req, res, next) => {
    try {
        const {code} = req.params
        res.redirect(FacebookOAuthLogin(code))

    } catch (e) {
        throw new ErrorClass(e.message, 500)
    }
})
export const AgentFacebookCallback = Async(async (req, res, next) => {
    try {
        const {code, state} = req.query
        req.session.accessToken = await FacebookOAuthGetAccessToken(code)
        req.session.code = state
        res.redirect('/api/v1/oauth/agent/facebook/user')
    } catch (e) {
        throw new ErrorClass(e.message, 500)
    }
})
export const AgentFacebookGetUser = Async(async (req, res, next) => {
    try {
        const accessToken = req.session.accessToken
        const code = req.session.code !== "undefined" ? req.session.code : false
        const result = await FacebookOAuthUserData(accessToken);
        const userObj = {
            email: result.email,
            verified: true,
            fullName: result.last_name + " " + result.first_name,
            imgUrl: result.picture.data.url,
            password: result.id,
            code
        }
        const {user, created} = await ModelAgent.OAuth(userObj)
        res.json(Utils.PrintRest("API Running - Ok", true, {user, created}))
    } catch (e) {
        console.log(e)
        throw new ErrorClass(e.message, 500)
    }
})