import { PrismaClient } from '@prisma/client';
import { Request } from 'express';

export interface Context {
  prisma: PrismaClient;
  req: Request;
}
const createContext = () => {
  const prisma = new PrismaClient();

  return ({ req, connection }): Context => {
    if (connection) {
      return connection.context;
    }

    return {
      req,
      prisma,
    };
  };
};

export { createContext }

export default createContext();
