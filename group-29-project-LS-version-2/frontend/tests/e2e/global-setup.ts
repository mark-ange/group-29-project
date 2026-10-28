import { execFileSync } from "node:child_process";
import { copyFileSync } from "node:fs";
import path from "node:path";

export default function globalSetup() {
  const cwd = process.cwd();
  const env = {
    ...process.env,
    DATABASE_URL: "file:./test.db",
    NODE_ENV: "test" as const,
    SEED_ADMIN_PASSWORD: "AdminPasswordForTests2026!",
    SEED_GUEST_PASSWORD: "GuestPasswordForTests2026!",
  };
  const prismaCli = path.join(cwd, "node_modules", "prisma", "build", "index.js");
  const tsxCli = path.join(cwd, "node_modules", "tsx", "dist", "cli.mjs");
  execFileSync(process.execPath, [prismaCli, "migrate", "deploy"], { cwd, env, stdio: "inherit" });
  execFileSync(process.execPath, [tsxCli, "prisma/seed.ts"], { cwd, env, stdio: "inherit" });
  copyFileSync(path.join(cwd, "prisma", "test.db"), path.join(cwd, "test.db"));
}
