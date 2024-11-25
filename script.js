// ドロップダウンの初期化
function populateSelectOptions() {
    const ranges = Array.from({ length: 11 }, (_, i) => i);  // 0~10
    const jobSelects = [
        'stamina', 'mind', 'skill', 'intelligence', 'focus', 'endurance', 'reflex', 'adv', // 基本ステータスのID
        'warrior', 'martial', 'scout', 'ranger', 'mage', 'priest', 'dragon', 'spirit', 'necro'  // 職業レベルのID
    ];

    jobSelects.forEach(id => {
        const select = document.getElementById(id);
        ranges.forEach(num => {
            const option = document.createElement('option');
            option.value = num;
            option.textContent = num;
            select.appendChild(option);
        });
    });
}

// 初期化を実行
window.onload = populateSelectOptions;

// 判定計算処理
function calculateChecks() {
    // 基本能力取得
    const stm = parseInt(document.getElementById('stamina').value);
    const mnd = parseInt(document.getElementById('mind').value);
    const skl = parseInt(document.getElementById('skill').value);
    const int = parseInt(document.getElementById('intelligence').value);
    const fcs = parseInt(document.getElementById('focus').value);
    const end = parseInt(document.getElementById('endurance').value);
    const ref = parseInt(document.getElementById('reflex').value);
    const adv = parseInt(document.getElementById('adv').value);

    // 職業レベル取得
    const war = parseInt(document.getElementById('warrior').value);
    const mar = parseInt(document.getElementById('martial').value);
    const sct = parseInt(document.getElementById('scout').value);
    const rng = parseInt(document.getElementById('ranger').value);
    const mag = parseInt(document.getElementById('mage').value);      
    const prs = parseInt(document.getElementById('priest').value);
    const drg = parseInt(document.getElementById('dragon').value);
    const spr = parseInt(document.getElementById('spirit').value);
    const ncr = parseInt(document.getElementById('necro').value);

    const maxbattleJob = Math.max(war, mar, sct);


    // 命中補正取得
    const hitB = parseInt(document.getElementById('hitB').value) || 0;  // 命中ボーナスのデフォルト値
    const dodgeB = parseInt(document.getElementById('dodgeB').value) || 0;  // 回避ボーナスのデフォルト値
    const speedB = parseInt(document.getElementById('speedB').value) || 0;  // 先制+機先のデフォルト値
    
    //基礎判定
    const stmfcs = stm + fcs; //体力集中系
    const stmend = stm + end; //体力持久系
    const stmref = stm + ref; //体力反射系
    const mndfcs = mnd + fcs; //魂魄集中系
    const mndend = mnd + end; //魂魄持久系
    const mndref = mnd + ref; //魂魄反射系
    const sklfcs = skl + fcs; //技量集中系
    const sklend = skl + end; //技量持久系
    const sklref = skl + ref; //技量反射系
    const intfcs = int + fcs; //知力集中系
    const intend = int + end; //知力持久系
    const intref = int + ref; //知力反射系

    // 判定計算
    const CC = stm + ref + war; //移動妨害判定
    const maxCCC = Math.max(stm + fcs + war, skl + fcs + war , stm + fcs + mar, skl + fcs + mar); //移動妨害対抗判定
    const hitResultText = [];  // 命中判定を格納する配列
    const resist = Math.max(prs, drg); //抵抗系判定
    const muscle = Math.max(war, mar);
    const sports = Math.max(sct, rng);
    const sports2 = Math.max(mar, sct, rng);
    const care = Math.max(rng, prs, drg, ncr);
    const magic =Math.max(mag, prs, drg, spr, ncr);
    const six = Math.max(rng, sct, spr);

    // 戦士、武闘家、斥候、野伏に基づいた命中判定を個別に表示
    if (war > 0) {
        hitResultText.push(`<div>GS${sklfcs+war+hitB} 命中判定(戦士)</div>`);
    }
    if (mar > 0) {
        hitResultText.push(`<div>GS${sklfcs+mar+hitB} 命中判定(武闘家)</div>`);
    }
    if (sct > 0) {
        hitResultText.push(`<div>GS${sklfcs+sct+hitB} 命中判定(斥候)</div>`);
    }
    if (rng > 0) {
        hitResultText.push(`<div>GS${sklfcs+rng+hitB} 命中判定(野伏)</div>`);
    }

    const dodge = skl + ref + maxbattleJob + dodgeB;  // 回避ボーナスを追加
    const hit = skl + fcs + (war > 0 ? war : 0) + (mar > 0 ? mar : 0) + (sct > 0 ? sct : 0) + (rng > 0 ? rng : 0) + hitB;  // 命中ボーナスを追加
    

    // 魔術系ジョブ判定計算 (該当レベルが1以上の場合)
    let magicCheck = 0;
    let magicMnt = 0;
    if (mag > 0) {
        magicCheck = int + fcs + mag;  // 知力集中 + 魔術師Lv
        magicMnt = int + end + mag; // 知力持久 + 魔術師Lv
    }

    let miracleCheck = 0;
    let miracleMnt = 0;
    if (prs > 0) {
        miracleCheck = mnd + fcs + prs; // 魂魄集中+神官Lv
        miracleMnt = mnd + end + prs; // 魂魄維持+神官Lv
    }

    let drgCheck = 0;
    let drgMnt = 0;
    if (drg > 0) { // 修正 (prs → drg)
        drgCheck = mnd + fcs + drg; // 魂魄集中+竜司祭Lv
        drgMnt = mnd + end + drg; // 魂魄維持+竜司祭Lv
    }

    let sprCheck = 0;
    let sprMnt = 0;
    if (spr > 0) { // 修正 (sprCheck → spr)
        sprCheck = mnd + fcs + spr; // 魂魄集中+精霊使いLv
        sprMnt = mnd + end + spr; // 魂魄維持+精霊使いLv
    }

    let ncrCheck = 0;
    let ncrMnt = 0;
    if (ncr > 0) {
        ncrCheck = int + fcs + ncr;  // 知力集中 + 死人占い師Lv
        ncrMnt = int + end + ncr; // 知力持久 + 死人占い師Lv
    }

    // 結果表示
    let resultText = ""; // 初期化
    resultText += '<div>─────────戦闘系判定─────────</div>';  // 最初にタイトルを追加
    
    // 先制判定
    if (speedB > 0) {
        resultText += `<div>GS${speedB} 先制+機先</div>`;
    } else if (speedB === 0) {
        resultText += `<div>GS${speedB} 先制</div>`;  // 0の時はGSだけ表示
    }

    
    if (hitResultText.length > 0) {
        resultText += hitResultText.join(""); // 配列を結合して表示
    }
    
    resultText += `<div>GS${dodge} 回避判定</div>`;  // 回避判定
    
    resultText +=`<div>GS${CC} 移動妨害判定</div>`; //移動妨害判定

    resultText +=`<div>GS${maxCCC} 移動妨害への対抗判定</div>`; //移動妨害への対抗判定 
    
    resultText += `<div>─────────抵抗系判定─────────</div>`;  // 最初にタイトルを追加
    resultText += `<div>GS${mndref + adv} 呪文抵抗(魂魄反射+冒)</div>`;
    resultText += `<div>GS${stmref + adv} 体力反射(体力反射+冒)</div>`;
    resultText += `<div>GS${mndref + resist} 魂魄抵抗(魂魄反射+冒or竜)</div>`;
    resultText += `<div>GS${intref + resist} 知力抵抗(知力反射+冒or竜)</div>`;
        

// 魔術系判定セクションの表示
let magicSectionVisible = false;
if (magicCheck > 0 || miracleCheck > 0 || drgCheck > 0 || sprCheck > 0 || ncrCheck > 0) {
    magicSectionVisible = true;
}

if (magicSectionVisible) {
    resultText += '<div>─────────魔術系判定─────────</div>'; // 魔術系判定セクション
    if (magicCheck > 0) {
        resultText += `<div>GS${magicCheck} 行使判定/魔術師</div>`;
        resultText += `<div>GS${magicMnt} 維持判定/魔術師</div>`;
    }

    if (miracleCheck > 0) {
        resultText += `<div>GS${miracleCheck} 行使判定/神官</div>`;
        resultText += `<div>GS${miracleMnt} 維持判定/神官</div>`;
    }

    if (drgCheck > 0) {
        resultText += `<div>GS${drgCheck} 行使判定/竜司祭</div>`;
        resultText += `<div>GS${drgMnt} 維持判定/竜司祭</div>`;
    }

    if (sprCheck > 0) {
        resultText += `<div>GS${sprCheck} 行使判定/精霊使い</div>`;
        resultText += `<div>GS${sprMnt} 維持判定/精霊使い</div>`;
    }

    if (ncrCheck > 0) {
        resultText += `<div>GS${ncrCheck} 行使判定/死人占い師</div>`;
        resultText += `<div>GS${ncrMnt} 維持判定/死人占い師</div>`;
    }
}

    resultText += '<div>─────────筋力系判定─────────</div>';  // 区切り
    resultText += `<div>GS${muscle + stmfcs} 怪力判定(体力集中+戦or武)</div>`; // 怪力判定
    resultText += `<div>GS${muscle + stmfcs} 脱出判定(体力集中+戦or武)</div>`; // 脱出判定
    resultText += `<div>GS${muscle + stmend} 登攀判定(体力持久+戦or武)</div>`; // 怪力判定

    resultText += '<div>─────────運動系判定─────────</div>';  // 区切り
    resultText += `<div>GS${adv + sklfcs} 水泳判定(技量集中+冒)</div>`; //水泳判定 
    resultText += `<div>GS${sports +sklend} 登攀/運動系(技量集中+野or斥)</div>`; //登攀判定運動系 
    resultText += `<div>GS${sports2 +sklfcs} 軽業判定(技量集中+武or野or斥)</div>`; //軽業判定
    resultText += `<div>GS${sports2 +sklfcs} 跳躍判定(技量集中+武or野or斥)</div>`; //跳躍判定
    resultText += `<div>回避判定</div>`;

    resultText += '<div>─────────操作系判定─────────</div>';  // 区切り
    resultText += `<div>GS${care + sklfcs} 応急手当判定(技量集中+野or神or竜or死)</div>`; //手当判定
    resultText += `<div>GS${sports + sklfcs} 手仕事判定(技量集中+野or斥)</div>`; //手仕事判定 
    resultText += `<div>命中判定</div>`;
    resultText += `<div>盾受け判定</div>`;

    resultText += '<div>─────────隠密系判定─────────</div>';  // 区切り
    resultText += `<div>GS${sports +sklfcs} 隠密判定(技量集中+野or斥)</div>`; //隠密判定
    resultText += `<div>手仕事判定</div>`;

    resultText += '<div>─────────知識系判定─────────</div>';  // 区切り
    resultText += `<div>GS${magic +intfcs} 怪物知識判定(知力集中+呪文系)</div>`; //怪物知識判定
    resultText += `<div>GS${magic +intfcs} 博識判定(知力集中+呪文系)</div>`; //博識判定
    resultText += `<div>GS${mag +intfcs} 魔法知識判定(知力集中+魔)</div>`; //魔法知識判定
 
    resultText += '<div>─────────感知系判定─────────</div>';  // 区切り
    resultText += `<div>GS${sports +intfcs} 観察判定(知力集中+野or斥)</div>` ;//博識判定
    resultText += `<div>GS${six +intref} 第六感判定(知力集中+野or斥or精)</div>`; //第六感判定

    resultText += '<div>─────────移動系判定─────────</div>';  // 区切り
    resultText += `<div>GS${adv +stmend} 長距離移動判定(体力持久+冒)</div>`; //長距離移動判定

    document.getElementById('result').innerHTML = resultText;
    
// フィールドリセット
function resetFields() {
    document.querySelectorAll('select').forEach(select => select.value = 0);
    document.getElementById('hitB').value = 0;  // 命中ボーナス
    document.getElementById('dodgeB').value = 0;  // 回避ボーナス
    document.getElementById('speedB').value = 0;  // 先制+機先ボーナス
    document.getElementById('result').innerHTML = ""; 
}};


async function copyOutput() {
    try {
        // .outputのテキストを取得
        const outputText = document.querySelector('.output').innerText;
        
        // Clipboard APIでクリップボードにコピー
        await navigator.clipboard.writeText(outputText);
        
        alert('コピー成功!');
    } catch (err) {
        console.error('コピー失敗:', err);
        alert('コピー失敗...');
    }
}
