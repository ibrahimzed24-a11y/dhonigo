"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ferry_controller_1 = require("../controllers/ferry.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.get('/', auth_middleware_1.authenticate, ferry_controller_1.getFerries);
router.post('/', auth_middleware_1.authenticate, (0, auth_middleware_1.authorize)(['OPERATOR', 'ADMIN']), ferry_controller_1.createFerry);
exports.default = router;
