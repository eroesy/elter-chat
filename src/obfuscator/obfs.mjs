import jsob from "javascript-obfuscator"
import fs from "node:fs"
import path from "node:path";
import {__dirname} from "../app.mjs"

let created = false;

export function obfuscate() {

    if (created)
        return;

    const script_path = `${path.join(__dirname, 'views', 'scripts')}`;
    const custom_path = `${path.join(__dirname, 'views', 'custom')}`;

    const all_files = fs.readdirSync(script_path);
    for (let i = 0; i < all_files.length; i++) {

        const file = path.join(script_path, all_files[i]);
        const file_source = fs.readFileSync(file).toString();

        const data = jsob.obfuscate(file_source, {
            compact: false,
            controlFlowFlattening: true,
            controlFlowFlatteningThreshold: 1,
            numbersToExpressions: true,
            simplify: true,
            stringArrayShuffle: true,
            splitStrings: true,
            stringArrayThreshold: 1
        }).getObfuscatedCode();

        fs.writeFileSync(path.join(custom_path, all_files[i]), data);    
    }

    created = true;
};