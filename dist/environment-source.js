"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnvironmentSource = void 0;
/**
 * A configuration source for all shell environment variables placed at the
 * root node using the reserved word `_env`.
 */
class EnvironmentSource {
    /**
     * Asynchronously loads the all shell environment variables and
     * converts them to json as needed.
     */
    loadConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                resolve({
                    description: 'env',
                    data: {
                        // TODO: Verify that 'process' is available (is this being run in a browser?)
                        // TODO: Allow the user to configure the root of the environment.
                        //       but notify that this should not be changed if possible.
                        // TODO: Allow a user to unflatten the env files so a value like NVM_DIR would be { nvm: { dir: ""}}
                        _env: process.env,
                    },
                });
            });
        });
    }
}
exports.EnvironmentSource = EnvironmentSource;
//# sourceMappingURL=environment-source.js.map