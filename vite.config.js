//GitHub Pages にデプロイするときに必要な設定

//Vite を使用した React プロジェクトの設定ファイルです。
//Vite は、モダンなフロントエンド開発のためのビルドツールで、高速なビルドとホットリロードを提供します。
//ここでは、React プロジェクト用の設定が行われています。

//全体の流れ
//この設定ファイルは、React プロジェクトを Vite でビルド・開発するための基本的なセットアップを提供します。
//プラグイン設定 によって、React 特有のビルドや開発サポートが有効化され、base 設定によってビルド時に出力される静的ファイルのルートパスが指定されます。

//まとめ
//React プラグイン を使用して、Vite で React プロジェクトを効率的に開発・ビルドできるようにします。
//base パスの設定 によって、環境に応じた出力パスを設定します（デフォルトではルート /）。
//この設定は、Vite による React プロジェクトのビルドと開発サーバーの最適化において基本的なものです。

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE_URL || '/',
});