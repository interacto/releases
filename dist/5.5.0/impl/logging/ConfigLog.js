import { Category, CategoryConfiguration, CategoryServiceFactory, LogLevel } from "typescript-logging";
CategoryServiceFactory.setDefaultConfiguration(new CategoryConfiguration(LogLevel.Info));
export const catInteraction = new Category("interaction");
export const catCommand = new Category("command");
export const catBinding = new Category("binding");
export const catFSM = new Category("fsm", catInteraction);
