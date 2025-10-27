/**
 * Slantapp code and properties {www.slantapp.io}
 */
import Async from "./../core/core.async.js";
import Mailer from "./../services/services.mail.js";
import { ModelProperty } from "../models/index.js";
import { ErrorClass, Utils } from "../core/index.js";

export const Track = Async(async (req, res, next) => {
  try {
    const { map } = req.body;
    const [track, created] = await ModelProperty.findOrCreate({
      where: { day: new Date().getDay() },
      defaults: { map },
    });
    if (!created) await track.update({ map: [...track.map, ...map] });
    res.json(Utils.PrintRest("API Running - Ok", true, track));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});
export const Polyline = Async(async (req, res, next) => {
  try {
    const track = await ModelProperty.findAll();
    res.json(Utils.PrintRest("General Polyline", true, track));
  } catch (e) {
    throw new ErrorClass(e.message, 500);
  }
});
