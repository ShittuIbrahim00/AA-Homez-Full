/**
 * Slantapp code and properties {www.slantapp.io}
 */
import express from 'express';
import {AgentConfirmEmail, AgentLogin, AgentRegister, Login, Register} from "../../controllers/controller.v1.auth.js";
//libraries


let router = express.Router();

/* GET users listing. */

router.post('/login', Login)
router.post('/register', Register)

router.post('/agent/login', AgentLogin)
router.post('/agent/register', AgentRegister)
router.get('/agent/confirm/:otp', AgentConfirmEmail)

export default router
