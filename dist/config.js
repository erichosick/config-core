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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var _sources, _priority;
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.Config = void 0;
/**
 * Config is setup to read from multiple sources (using addSource) and then
 * provide easy access to configuration from multiple sources using the get
 * and env methods. See documentation for details.
 */
class Config {
    constructor() {
        /* Sources that have been attached to the Config instance */
        _sources.set(this, []);
        /* The last priority number used when adding a configuration source */
        _priority.set(this, 10);
    }
    /**
     * Verifies that an item is an object.
     * @param item The item being verified.
     */
    static isObject(item) {
        return item === null ? false : typeof item === 'object';
    }
    /**
     * Deep copy merges provided items. TODO: deep copy.
     * @param lowerPrecidence The item we are merging into. Any values in
     * upperPrecidence will overwrite values in lowerPrecidence.
     * @param upperPrecidence The item we are merging from. Values in this
     * item will override values in the lowerPrecidence item.
     * @param path The initial path that we are merging items from. This is NOT
     * the active path we are merging. Used for error handling.
     */
    static merge(lowerPrecidence, upperPrecidence, path) {
        let isLowerObj = Config.isObject(lowerPrecidence);
        let isUpperObj = Config.isObject(upperPrecidence);
        if (null === lowerPrecidence || undefined === lowerPrecidence) {
            return upperPrecidence;
        }
        else if (null === upperPrecidence || undefined === upperPrecidence) {
            return lowerPrecidence;
        }
        else if (isLowerObj && isUpperObj) {
            return Object.assign(Object.assign({}, lowerPrecidence), upperPrecidence);
        }
        else if (isLowerObj || isUpperObj) {
            throw new Error(`Property '${path}' resolves to a primitive and an object which can not be merged`);
        }
        else {
            return upperPrecidence;
        }
    }
    /**
     * Returns all sources attached to the configuration instance.
     */
    get sources() {
        return __classPrivateFieldGet(this, _sources);
    }
    /**
     * AddSource adds a configuration source to the configuration instance by
     * first loading the configuration (loadConfig()), adding a priority and
     * finally pushing it to the sources() Array. See sources().
     * @param source - A configuration source (File, Environment, Http etc.)
     */
    addSource(source) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => __awaiter(this, void 0, void 0, function* () {
                const sourceType = yield source.loadConfig();
                sourceType.priority = __classPrivateFieldGet(this, _priority);
                __classPrivateFieldSet(this, _priority, __classPrivateFieldGet(this, _priority) + 10);
                __classPrivateFieldGet(this, _sources).push(sourceType);
                resolve();
            }));
        });
    }
    /**
     * Returns any shell environment values if they were loaded.
     * @param key The shell environment name such as PATH, NODE_ENV, etc.
     * @ Returns The value associated with the key. If no value is found,
     *           null is returned.
     */
    env(key) {
        let result = null;
        __classPrivateFieldGet(this, _sources).forEach((sources) => {
            if (sources.data.hasOwnProperty('_env')) {
                let item = sources.data._env;
                result = item.hasOwnProperty(key) ? Config.merge(result, item[key], key) : result;
            }
        });
        return result;
    }
    /**
     * Validates and returns the current configuration environment.
     */
    getConfigEnvironment() {
        const env = {
            platform: this.env('CONFIG_PLATFORM'),
            compute: this.env('CONFIG_COMPUTE'),
            environment: this.env('NODE_ENV'),
        };
        if (!env.platform || !env.compute || !env.environment) {
            const missing = [];
            if (!env.platform) {
                missing.push('CONFIG_PLATFORM');
            }
            if (!env.compute) {
                missing.push('CONFIG_COMPUTE');
            }
            if (!env.environment) {
                missing.push('NODE_ENV');
            }
            throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
        }
        return env;
    }
    /**
     * Given an absoulute path, getAbsolute will pull the corrrect configuration
     * values out.
     * @param path Absolute path (including _shared, platform, process and env
     * path values)
     * @param property Used for error messages, the initial path we are pulling values
     * from not including the absoulute path values.
     * @param currentConfig The current configuration we are building. Items
     * located
     */
    getAbsolute(path, property, currentConfig = undefined) {
        const properties = path.split('.');
        this.sources.forEach((source) => {
            let current = source.data;
            properties.forEach((prop, index) => {
                if (current.hasOwnProperty(prop)) {
                    if (index + 1 === properties.length) {
                        currentConfig = Config.merge(currentConfig, current[prop], property);
                    }
                    else {
                        current = current[prop];
                    }
                }
            });
        });
        return currentConfig;
    }
    /**
     * Given a path within the configruation hierarchy, get will pull the
     * correct configuration values automatically taking into account the
     * CONFIG_PLATFORM, CONFIG_COMPUTE, and NODE_ENV contexts.
     * @param path The path within the configuation hierarchy. An example path
     * would be 'user.name'.
     */
    get(path) {
        const env = this.getConfigEnvironment();
        // Merging of configurations always starts from least specific
        // to most specific. From _shared._shared._shared to specific
        // platform.compute.env.
        // NOTE: Code could probably be refactored but this makes it easy to read.
        let result = this.getAbsolute(`_shared._shared._shared.${path}`, path);
        result = this.getAbsolute(`_shared._shared.${env.environment}.${path}`, path, result);
        result = this.getAbsolute(`_shared.${env.compute}._shared.${path}`, path, result);
        result = this.getAbsolute(`_shared.${env.compute}.${env.environment}.${path}`, path, result);
        result = this.getAbsolute(`${env.platform}._shared._shared.${path}`, path, result);
        result = this.getAbsolute(`${env.platform}._shared.${env.environment}.${path}`, path, result);
        result = this.getAbsolute(`${env.platform}.${env.compute}._shared.${path}`, path, result);
        result = this.getAbsolute(`${env.platform}.${env.compute}.${env.environment}.${path}`, path, result);
        return result;
    }
}
exports.Config = Config;
_sources = new WeakMap(), _priority = new WeakMap();
/**
 * A singleton config instance that can be shared throughout the application
 * If you would prefer not to use the singleton config pattern, then you can
 * always create your own config instance.
 */
exports.config = new Config();
//# sourceMappingURL=config.js.map