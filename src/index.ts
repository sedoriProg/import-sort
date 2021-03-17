import * as fs from "fs";

(async () => {
    // 本格的にやるならディレクトリごと取得して.tsや.tsxファイルの中身を操作
    const path = __dirname + "/../sampleCodes/targetCode.ts";
    const file = fs.readFileSync(path);
    const lines = file.toString().split("\n");

    // 文頭のimportの行数をカウントする
    // あとで元のコードのimport群を削除する用
    let importLineCount = 0;
    let countFlag = true;
    const nodeModules: string[] = [];
    const modules: {line: string, module: string}[] = [];
    
    lines.forEach(l => {
        if(l.indexOf("import") === 0){
            // from以降の取得
            const module = l.slice(l.indexOf("from")).slice(6)

            // node_modulesと自分のモジュール分ける。とりあえず、./があるかないかで判断
            if(module.indexOf("./") === 0){
                modules.push({
                    line: l,
                    module: module.slice(2) // ./削除
                })
            }else{
                nodeModules.push(l);
            }
            importLineCount++;
            return;
        }
        
        // すでにコメントで分けている場合もあるのでカウント
        // スラッシュ3本にするなどして差別化してもいいかも
        // また、import群じゃなくなるまで空行もカウント
        if(countFlag && (l.indexOf("//") === 0 || l.indexOf("/*") === 0 || l === "")){
            importLineCount++;
        }else{
            // import群じゃなくなったらもうカウントする必要ない
            countFlag = false;
        }
    })

    // ラベル用のリスト。配列でもいいけどMapの方が量によっては参照早い
    const exsistLabelMap = new Map();
    const sortedModules:string[] = [];
    modules.sort((a, b) => {
        if(a.module < b.module) return -1;
        if(a.module > b.module) return 1;
        return 0
    })
    modules.forEach(m => {
        const [moduleName] = m.module.split("/");
        if(!exsistLabelMap.get(moduleName)){
            // モジュールのラベルコメント
            sortedModules.push(`/* ${moduleName} */`);
            exsistLabelMap.set(moduleName, "exist")
        }
        sortedModules.push(m.line);
    })
    const writeDatas: string[] = [...nodeModules.sort(), ...sortedModules, "", ...lines.splice(importLineCount, lines.length)];
    
    fs.writeFileSync(path, writeDatas.join("\n"))
})()