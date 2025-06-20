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
import ShootingGame from "./ShootingGame";  // ShootingGame コンポーネントをインポート

function App() {
  const [name, setName] = useState("");   // ユーザー名の状態
  const [isGameStarted, setIsGameStarted] = useState(false);  // ゲームが開始されたかどうかの状態
  const [isError, setIsError] = useState(false);  // エラーハンドリング用の状態

  // LIFFの初期化とユーザー情報の取得
  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID, // LIFF IDを環境変数から取得
      })
      .then(() => {
        liff.getProfile()
          .then((profile) => {
            setName(profile.displayName); // プロフィールからユーザー名を取得して状態にセット
          })
          .catch((error) => {
            console.error("プロフィール取得失敗:", error);
            setIsError(true); // エラー発生時
          });
      })
      .catch((error) => {
        console.error("LIFF初期化失敗:", error);
        setIsError(true); // エラー発生時
      });
  }, []);

  // ゲーム開始の処理
  const startGame = () => {
    setIsGameStarted(true);  // ゲームを開始
  };

  // メニュー画面とゲーム画面を切り替えるロジック
  return (
    <div className="App">
      {isError ? (
        <p>エラーが発生しました。もう一度試してください。</p>
      ) : (
        <>
          {name ? (
            <>
              <p>こんにちは、{name}さん</p>
              {isGameStarted ? (
                <ShootingGame />  // ゲームを表示
              ) : (
                <div>
                  <h2>ゲームメニュー</h2>
                  <button onClick={startGame}>シューティングゲームを始める</button>
                  {/* 他のゲームオプションも追加可能 */}
                </div>
              )}
            </>
          ) : (
            <p>ユーザー情報を取得中...</p>
          )}
        </>
      )}
    </div>
  );
}

export default App;