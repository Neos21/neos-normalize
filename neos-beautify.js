/**
 * node-sass で neos-normalize.scss をトランスパイルすると
 * 
 * - 勝手に Charset 指定が書かれる
 * - コメント間の空行が削られる
 * - 0 以上 1 未満の小数が .5 とならず 0.5 と出力される
 * 
 * といった不備があり、元ファイルとの嫌な差分が出るので、泥臭く修正することにする
 * この修正で neos-normalize.scss と neos-normalize.css の差分は SCSS 変数の展開部分だけになる
 */

const fs = require('fs');

// 編集対象ファイル
const filePath = './neos-normalize.css';

// 整形後のテキストを控えておく配列
const beautifiedTextArray = [];

// テキストを読み込む
const originalText = fs.readFileSync(filePath, 'utf-8');

// 1行ごとに処理する
originalText.split('\n').forEach((line) => {
  // Charset 指定の行は消すため何もしない
  if(line === '@charset "UTF-8";') {
    return;
  }
  
  // ブロック開始コメントの上に空行を付ける
  if(line === '/* ==================================================') {
      beautifiedTextArray.push('');
  }
  
  // なぜか 0 が付く行があるので修正する (figure 要素の border-left)
  if(line.includes('0.5em')) {
    line = line.replace('0.5em', '.5em');
  }
  
  // 当該行を出力する
  beautifiedTextArray.push(line);
  
  // 開始コメント行とブロック終了コメントの下に空行を付ける
  if(line.startsWith('/*!') || line === ' * ================================================== */') {
    beautifiedTextArray.push('');
  }
});

// LF で結合する
const beautifiedText = beautifiedTextArray.join('\n');

// 編集対象ファイルに書き直す
fs.writeFileSync(filePath, beautifiedText);
