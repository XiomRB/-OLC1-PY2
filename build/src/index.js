"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const rutas_1 = __importDefault(require("./rutas"));
var cors = require('cors');
const app = express_1.default();
//configs
app.set('port', process.env.PORT || 3000);
//middlewares
app.use(express_1.default.json()); //interpreta json restapi
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors());
//rutas
app.use('/api', rutas_1.default);
//iniciando servidor
app.listen(app.get('port'), () => {
    console.log(`Server on port ${app.get('port')}`);
});
