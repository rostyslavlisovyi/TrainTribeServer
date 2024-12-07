import {Response} from "express";
const mongoose = require("mongoose");
const validationId = (id:string, res:Response) => {
    if (!mongoose.isValidObjectId(id)) {
        res.status(400).json({ message: "INVALID ID FORMAT" });
        return false;
    }
    return true;
};

module.exports = {
    validationId,
};
