# Benefit One LINE Mini App Demo

ベネフィットワン向けの提案デモとして作成した、LINEミニアプリです。
想定する提供形態は LINEミニアプリですが、現在のデモは実LINEログインを使わず、見た目だけログイン風の導線にしています。

## デモ内容

- 起動時にミニアプリを初期化
- LINEログイン風の画面を表示
- ログインボタン押下後に「マイクーポン」を表示

## ファイル構成

- `index.html`: 画面本体
- `styles.css`: UIスタイル
- `app.js`: デモ用ログイン遷移、クーポン描画
- `config.js`: LIFF ID などの設定

## 初期設定

1. LINE Developers でミニアプリ用のアプリ設定を作成
2. 必要に応じて `config.js` をデモ設定に合わせて更新
3. HTTPS で配信できる場所に静的配置

```js
window.APP_CONFIG = {
  liffId: "2007654321-ExampleAb",
  benefitOneLoginUrl: "/",
  storageKey: "benefit-one-demo-session",
};
```

## ローカル確認

単純な静的配信で動きます。

```bash
python3 -m http.server 8080
```

その後、`http://localhost:8080` を開いて UI を確認できます。

## 実運用に向けた差し替えポイント

- `simulateLineLogin()`:
  実際の LINEログインまたは LIFF 初期化処理に差し替え
- `mockCoupons`:
  会員ごとのクーポン API レスポンスに差し替え

## テスト用にミニアプリ化する流れ

1. このアプリを `https://...` で公開する
2. LINE Developers でベネフィットワン用の provider を選ぶ
3. 新規のミニアプリとして進める前提で、対象チャネルを作成または選択する
4. チャネルの `LIFF` 設定でミニアプリのエントリを追加する
5. Endpoint URL に公開URLを設定する
6. Scope は少なくとも `profile` を付ける
7. `config.js` に発行された LIFF ID を設定する
8. 発行された LIFF URL でテストする

## 提案時の説明ポイント

- 初回起動時は LINEログイン風の画面を表示
- ログインボタン押下後はクーポンを即時表示
- 実運用では会員認証 API とクーポン API をつなぐだけで基本構造は流用可能

## 想定デモフロー

1. ユーザーが LINE からミニアプリを起動
2. LINEログイン風ボタンを押下
3. マイクーポン一覧を表示
