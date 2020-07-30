"use strict";

const test = require("ava");
const request = require("supertest");
const sinon = require("sinon");
const proxyquire = require("proxyquire");

const agentFixtures = require("./fixtures/agent");

let sandbox = null;
let server = null;
let dbStub = null;
let AgentStub = {};
let MetricStub = {};

test.beforeEach(async () => {
  sandbox = sinon.sandbox.create();

  dbStub = sandbox.stub();
  dbStub.returns(
    Promise.resolve({
      Agent: AgentStub,
      Metric: MetricStub
    })
  );

  AgentStub.findConnected = sandbox.stub();
  AgentStub.findConnected.returns(Promise.resolve(agentFixtures.connected));

  const api = proxyquire("../api", {
    "platziverse-db": dbStub
  });

  server = proxyquire("../server", {
    "./api": api
  });
});

test.afterEach(() => {
  sandbox && sinon.sandbox.restore();
});
//para probar funciones de tipo callback
test.serial.cb("/api/agents", t => {
  request(server) //aqui llamo al server
    .get("/api/agents")
    .expect(200)
    .expect("Content-Type", /json/) //el content type debe contener la palabra json
    .end((err, res) => {
      t.falsy(err, "should not return an error"); // no debe haber algun error
      let body = res.body;
      t.deepEqual(body, {}, "response body should be the expected"); //la res debe ser {}
      t.end(); //esto se pone solo cuando el test es test.serial.cb
    });
});
