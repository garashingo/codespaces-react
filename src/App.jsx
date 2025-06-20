//全体の流れ
//アプリ初期化: useEffect で liff.init() が呼び出され、LIFF アプリが初期化されます。
//プロフィール取得: 初期化が成功した場合、LINE ユーザーのプロフィールが取得され、その名前が name に格納されて表示されます。
//エラーハンドリング: 初期化やプロフィール取得が失敗した場合は、そのエラーが画面に表示されます。

//まとめ
//このコードは、LINE の LIFF SDK を使って、ユーザーの名前を取得して画面に表示するシンプルな React アプリケーションです。LIFF の初期化状態やエラー、ユーザー名を useState と useEffect を使って管理し、状態が変化するたびに画面に反映させています。
//LIFF初期化の成功・失敗に応じたメッセージを表示。
//ユーザーの名前を取得し表示（LINEアカウント情報を取得）。

import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

function App() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [name, setName] = useState("");

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID
      })
      .then(() => {
        setMessage("LIFF init succeeded.");
        liff.getProfile()
          .then((profile) => {
            setName(profile.displayName);
          })
          .catch((err) => {
            console.log("error", err);
          });
      })
      .catch((e) => {
        setMessage("LIFF init failed.");
        setError(`${e}`);
      });
  });

  return (
    <div className="App">
      {message && <p>{message}</p>}
      {error && (
        <p>
          <code>{error}</code>
        </p>
      )}
      {name && <p>こんにちは、{name}さん</p>}
    </div>
  );
}

export default App;