# Benefit One LINE Mini App Demo

ベネフィットワン向けの提案デモとして作成した、LINEミニアプリです。
実装上は LIFF SDK を利用していますが、想定する提供形態は LINEミニアプリです。

## デモ内容

- 起動時にミニアプリを初期化
- LINEログイン済みユーザーの判定
- ベネフィット会員未連携の場合は会員ログイン画面を表示
- 会員連携後は「マイクーポン」を表示

## ファイル構成

- `index.html`: 画面本体
- `styles.css`: UIスタイル
- `app.js`: ミニアプリ初期化、会員連携フロー、クーポン描画
- `config.js`: LIFF ID などの設定

## 初期設定

1. LINE Developers でミニアプリ用のアプリ設定を作成
2. `config.js` の `liffId` を実際の LIFF ID に置き換え
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

- `buildMemberSession()`:
  ベネフィットワン会員認証 API 連携に差し替え
- `mockCoupons`:
  会員ごとのクーポン API レスポンスに差し替え
- `benefitOneLoginUrl`:
  実際の会員ログイン URL や SSO 遷移先に接続

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

- 初回起動時は LINE ログインを自動確認
- 会員未連携ユーザーにはベネフィット会員ログインを表示
- 連携済みならクーポンを即時表示
- 実運用では会員認証 API とクーポン API をつなぐだけで基本構造は流用可能

## 想定デモフロー

1. ユーザーが LINE からミニアプリを起動
2. LINEログイン済みでなければ認証
3. 会員連携がなければベネフィット会員ログイン
4. 連携後、マイクーポン一覧を表示
