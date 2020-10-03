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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _fileAbsolutePath, _rootOffset;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileSource = void 0;
const fs_1 = __importDefault(require("fs"));
/**
 * FileSource supports loading configuration and settings from a file.
 * Supported file types are: .json, .ts.
 * NOTE: .yml and others will be moved to their own libraries.
 */
class FileSource {
    /**
     * Creates in instance of a FileSource.
     * @param fileAbsolutePath Absolute path to file which contains configuration.
     * @param rootOffset (Optional) Wraps configured json in the context of
     * properties here. A value of 'level-01.level02' would result in data
     * being placed in `{ level-01: {level-02: data}}`.
     */
    constructor(fileAbsolutePath, rootOffset = '') {
        _fileAbsolutePath.set(this, void 0);
        _rootOffset.set(this, void 0);
        __classPrivateFieldSet(this, _fileAbsolutePath, fileAbsolutePath);
        __classPrivateFieldSet(this, _rootOffset, rootOffset);
    }
    /**
     * Returns file extension from an absolute path to the file.
     * @param fileAbsolutePath Absolute path to file.
     */
    static _fileExtension(fileAbsolutePath) {
        const fnSplit = fileAbsolutePath.split('.');
        if (fnSplit.length <= 1) {
            throw new Error(`File '${fileAbsolutePath}' is not a valid or is missing a file extension`);
        }
        return fnSplit[fnSplit.length - 1].toLowerCase();
    }
    /**
     * Asynchronously loads the file configuration and converts it to json as needed.
     *
     * @Returns Return, upon promise resolution (await), an ISourceType containing
     * the configuration data.
     */
    loadConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve) => {
                const fileExtension = FileSource._fileExtension(__classPrivateFieldGet(this, _fileAbsolutePath));
                const description = `file: ${__classPrivateFieldGet(this, _fileAbsolutePath)}`;
                let data;
                switch (fileExtension) {
                    case 'json':
                        const bufferData = fs_1.default.readFileSync(__classPrivateFieldGet(this, _fileAbsolutePath), 'utf8');
                        if (bufferData.length === 0) {
                            data = {};
                        }
                        else {
                            try {
                                data = JSON.parse(bufferData);
                            }
                            catch (err) {
                                throw new Error(`${__classPrivateFieldGet(this, _fileAbsolutePath)}: ${err.message}`);
                            }
                        }
                        break;
                    case 'ts':
                        const fsData = require(__classPrivateFieldGet(this, _fileAbsolutePath));
                        const numOfProperties = Object.keys(fsData).length;
                        if (numOfProperties > 1) {
                            throw new Error(`The typescript config file '${__classPrivateFieldGet(this, _fileAbsolutePath)}' must contain no more than one export`);
                        }
                        data = numOfProperties === 0 ? {} : fsData[Object.keys(fsData)[0]];
                        break;
                    default:
                        throw new Error(`File extension '${fileExtension}' not supported`);
                }
                if (__classPrivateFieldGet(this, _rootOffset) !== '') {
                    let newData = {};
                    let curData = newData;
                    let properties = __classPrivateFieldGet(this, _rootOffset).split('.');
                    properties.forEach((propName, index) => {
                        curData[propName] = properties.length === index + 1 ? data : {};
                        curData = curData[propName];
                    });
                    data = newData;
                }
                resolve({
                    description,
                    data,
                });
            });
        });
    }
}
exports.FileSource = FileSource;
_fileAbsolutePath = new WeakMap(), _rootOffset = new WeakMap();
//# sourceMappingURL=file-source.js.map