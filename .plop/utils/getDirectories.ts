import { readdirSync } from "fs";

export const getDirectories = (source: string) =>
  readdirSync(source, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)

export const getFiles = (source: string) =>
readdirSync(source, { withFileTypes: true })
  .filter(dirent => dirent.isFile())
  .map(dirent => dirent.name)
