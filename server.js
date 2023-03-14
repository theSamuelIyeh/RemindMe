"use strict";
const express = require("express");
const body_parser = require('body-parser');
const app = express().use(body_parser.json());

const mainRoutes = require("./routes/main");

app.use("/webhook", mainRoutes);

app.listen(process.env.PORT || 1337, () => console.log("webhook is listening"));
