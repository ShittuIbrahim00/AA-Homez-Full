/**
 * Slantapp code and properties {www.slantapp.io}
 */
import 'dotenv/config.js'
import {ErrorClass} from "./index.js";

const GoogleOAuthLogin = (state) => {
    try {
        const queryParams = new URLSearchParams({
            scope: "profile email",
            response_type: 'code',
            client_id: process.env.CLIENT_ID,
            redirect_uri: process.env.REDIRECT_URI,
            prompt: 'select_account',
            state
        })
        return `https://accounts.google.com/o/oauth2/v2/auth?${queryParams}`
    } catch (e) {
        throw new ErrorClass(e.message, 500)
    }
}

const GoogleOAuthCallback = async (code) => {
    try {
        const requestBody = {
            grant_type: 'authorization_code',
            code,
            client_id: process.env.CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.REDIRECT_URI
        }

        const options = {
            method: 'POST',
            body: JSON.stringify(requestBody),
            headers: {'Content-Type': 'application/json'}
        }

        const response = await (await fetch('https://oauth2.googleapis.com/token', options)).json()
        return {accessToken: response.access_token, idToken: response.id_token}

        //redirect back to OAuth user route
    } catch (e) {
        throw new ErrorClass(e.message, 500)
    }
}

const GoogleOAuthUser = async (accessToken, idToken) => {
    try {
        const userEndpoint = `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
        const options = {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json'
            }
        }

        return await (await fetch(userEndpoint, options)).json();
    } catch (e) {
        throw new ErrorClass(e.message, 500)
    }
}

const FacebookOAuthLogin = (state = undefined) => {
    try {
        return `https://www.facebook.com/v17.0/dialog/oauth?client_id=${process.env.APP_ID}&display=popup&&response_type=code&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&state=${state}&auth_type=rerequest&scope=email`
    } catch (e) {
        throw new ErrorClass(e.message, 500)
    }
}

const FacebookOAuthGetAccessToken = async (code = undefined) => {
    try {
        const params = new URLSearchParams({
            client_id: process.env.APP_ID,
            client_secret: process.env.APP_SECRET,
            redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
            code,
        });
        const data = await (await fetch(`https://graph.facebook.com/v17.0/oauth/access_token?${params}`)).json()
        return data.access_token
    } catch (e) {
        throw new ErrorClass(e.message, 500)
    }
}

const FacebookOAuthUserData = async (accessToken) => {
    try {
        const params = new URLSearchParams({
            fields: ['id', 'email', 'first_name', 'last_name', 'picture'].join(','),
            access_token: accessToken,
        })
        return await (await fetch(`https://graph.facebook.com/me?${params}`)).json()
    } catch (e) {
        throw new ErrorClass(e.message, 500)
    }
}

export {
    GoogleOAuthLogin,
    GoogleOAuthCallback,
    GoogleOAuthUser,
    FacebookOAuthLogin,
    FacebookOAuthGetAccessToken,
    FacebookOAuthUserData
}
