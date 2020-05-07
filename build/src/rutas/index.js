"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
var parser = require("../Gramatica/gramatica").parser;
const router = express_1.Router();
router.post('/', (req, res) => {
    var entrada = req.body.text;
    var resultado;
    if (entrada != "")
        resultado = parsear(entrada);
    else
        resultado = "No hay texto";
    res.send(resultado);
});
function parsear(texto) {
    return JSON.stringify(parser.parse(texto), null, 2);
}
exports.default = router;
