import express from 'express';
import {ErrorClass, Utils} from "../core/index.js";
import {ModelProperty} from "../models/index.js";

let router = express.Router();

/* GET home page. */
router.get('/', async function (req, res) {
    try {
        res.json(Utils.PrintRest("API Running - Ok", true, []))
    } catch (e) {
        throw new ErrorClass(e.message, 500)
    }
});

export default router;
