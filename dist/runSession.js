import { setTimeout } from "timers/promises";
/**
 * Create a new session.
 * @param { number } sessionNumber
 */
export default async function runSession(sessionNumber) {
    await setTimeout(1000);
    console.log(sessionNumber);
}
//# sourceMappingURL=runSession.js.map