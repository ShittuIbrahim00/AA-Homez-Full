/**
 * Slantapp code and properties {www.slantapp.io}
 */
import express from 'express';
//libraries
import {ControllerLogin} from './../../controllers/controller.v1.auth.js'
import {ModelProperty} from "../../models/index.js";
import {Utils} from "../../core/index.js";
import {MiddlewareApiGuard} from "../../middleware/middleware.v1.guard.js";
import {Polyline, Track} from "../../controllers/controller.v1.user.js";

let router = express.Router();
/* GET users listing. */
router.get('/', ControllerLogin, function (req, res, next) {
    res.send('respond with a user resource and email must be sent');
});

//MAP TRACKER
router.get('/map/tracks', MiddlewareApiGuard, Polyline)

router.get('/map/track/:id', async (req, res) => {
    const track = await ModelProperty.findOne({where: {tid: req.params.id}});
    res.json(Utils.PrintRest("API Running - Ok", true, track))
})

router.post('/map/track', Track)

//export default
export default router
