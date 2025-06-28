import passport from "passport";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";

import { comparePasswords } from "./auth-service";
import { storage } from "server/services/storage";

declare global {
  namespace Express {
    interface User {
      id: string;
      username: string;
      email: string;
      password: string;
      isAnonymous?: boolean | null;
      createdAt?: Date | null;
      updatedAt?: Date | null;
    }
  }
}

export function setupPassport(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "dev-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      let user = await storage.getUserByUsername(username);
      if (!user) user = await storage.getUserByEmail(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      }
      return done(null, user);
    })
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    const user = await storage.getUserById(id);
    done(null, user);
  });
}
