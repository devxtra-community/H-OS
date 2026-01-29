import baseLogger from "../shared/logger/index.js";
const logger = baseLogger.child({
    service: "patient-service",
});
export default logger;
