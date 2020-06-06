import express from 'express';
import { ContainerInstance } from 'typedi';

export interface Context {
  container: ContainerInstance;
  request: express.Request;
  response: express.Response;
}
