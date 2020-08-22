---
title: インメモリデータベースredisを触ってみた（初回編）
date: "2020-08-22"
template: "post"
draft: false
slug: "learning-redis-1"
category: "Engineer"
tags:
  - "golang"
  - "redis"
  - "isucon"
description: "isuconの事前学習としてredisについて学習してみたものをまとめています。
触り始めなのである程度、基本的なコマンドを網羅したい。"
socialImage: "/media/2020-08-22.jpeg"
---

## 概要
isuconの事前学習としてredisについて学習してみたものをまとめています。
触り始めなのである程度、基本的なコマンドを網羅したい。

redisについて(wiki参照 https://ja.wikipedia.org/wiki/Redis)
>Redisは、ネットワーク接続された永続化可能なインメモリデータベース。連想配列（キー・バリュー）、リスト、セットなどのデータ構造を扱える。いわゆるNoSQLデータベースの一つ。オープンソースソフトウェアプロジェクトであり、Redis Labs（英語版）がスポンサーとなって開発されている。

- メモリにデータをkey, valueの形で保存することができる。
- データをキャッシュする際に使用されている。

# redisの導入

macOSのみ
```zsh
brew install redis
```

その後起動させる
```zsh
redis-server
```

redis-cliコマンドを使用すれば対話的にredisのコマンドを打ち込むことができる。


# 基本的なコマンド

#### SET
データをkey, valueの形で保存する。

#### GET
keyを指定してデータを取得する。

#### DEL 
keyを指定してデータを削除する。

#### EXISTS
keyに対応するデータが存在するかどうかを調べる。


これらの動作をredigo/redisを使用して動作を確認していく。

※関数等にまとめた方がいいが今回は学習なので省略

```go
package main

import (
	"fmt"
	"log"

	"github.com/garyburd/redigo/redis"
)

func main() {
	// redisの初期portは6379
	port := "127.0.0.1:6379"
	redisClient, err := redis.Dial("tcp", port)
	if err != nil {
		log.Fatalf("Failed to connect: %s", err.Error())
	}
	defer redisClient.Close()

	// SET: HOGEにVALUEを保存する
	// redisClient.Do("SET", KEY, VALUE)
	_, err = redisClient.Do("SET", "HOGE", "VALUE")
	if err != nil {
		log.Fatalf("Failed to set value: %s", err.Error())
	}

	// GET: HOGEからVALUEを取得する
    // redisClient.Do("GET", KEY)
    // 出力: VALUE
	value, err := redis.Bytes(redisClient.Do("GET", "HOGE"))
	if err != nil {
		log.Fatalf("data: %s", err.Error())
	}

	// 返り値は[]byte型なのでstringに変換して出力
	fmt.Println(string(value))

	// DELETE: keyのHOGEを削除する
	// redisClient.Do("DEL", KEY)
	_, err = redisClient.Do("DEL", "HOGE")
	if err != nil {
		log.Fatalf("DELETE: %s", err.Error())
	}

	// EXISTS: 存在を確認する
	// redisClient.Do("EXISTS", KEY)
	ok, err := redis.Bool(redisClient.Do("EXISTS", "HOGE"))
	if err != nil {
		log.Fatalf("EXISTS: %s", err.Error())
	}
	// HOGEは削除したのでfalseが出力される
	fmt.Println(ok)
}

```

# list型のコマンド

#### RPUSH
keyに対応するリストにデータを挿入

#### LRANGE
keyに対応するリストのデータを返す

#### LINDEX
keyに対応するリストの指定したindexのデータを返す

#### LREM

keyに対応するリストの指定したvalueのデータを削除する

```go
package main

import (
	"fmt"
	"log"

	"github.com/garyburd/redigo/redis"
)

func main() {
	// redisの初期portは6379
	port := "127.0.0.1:6379"
	redisClient, err := redis.Dial("tcp", port)
	if err != nil {
		log.Fatalf("Failed to connect: %s", err.Error())
	}
	defer redisClient.Close()

	// RPUSH:keyに対応するリストの先頭にデータを保存していく
	// redisClient.Do("RPUSH", KEY, VALUE)
	// リストが存在しなければ、データ挿入前にkeyに対応する空のリストを作成する
	_, err = redisClient.Do("RPUSH", "school", "一学期")
	_, err = redisClient.Do("RPUSH", "school", "二学期")
	_, err = redisClient.Do("RPUSH", "school", "三学期")
	if err != nil {
		log.Fatalf("RPUSH: %s", err.Error())
	}

	// LRANGE:keyに対応するリストのデータを返す
	// redisClient.Do("LRANGE", "school", start, stop)
	// 0を基準としたindexで取得するデータのインデックスの開始位置と終了位置を
	// 指定することによりデータを取得する。-1はリストの最後尾のデータを指定している
	value, err := redis.Strings(redisClient.Do("LRANGE", "school", 0, -1))
	if err != nil {
		log.Fatalf("LRANGE: %s", err.Error())
	}
	//[一学期 二学期 三学期]
	fmt.Println(value)

	// LINDEX:keyに対応するリストの指定したindexのデータを返す
	// redisClient.Do("LINDEX", key, index)
	value2, err := redis.String(redisClient.Do("LINDEX", "school", 1))
	if err != nil {
		log.Fatalf("LINDEX: %s", err.Error())
	}
	//二学期
	fmt.Println(value2)

	// LREM: keyに対応するリストの指定したvalueのデータを削除する
	// redisClient.Do("LREM", key, count, value)
	// count > 0ならば先頭から最初に一致したvalueを持つデータを削除
	// count < 0ならば後方から最初に一致したvalueを持つデータを削除
	// count = 0ならば全ての指定したvalueを持つデータを削除
	_, err = redisClient.Do("LREM", "school", 1, "一学期")
	if err != nil {
		log.Fatalf("LREM: %s", err.Error())
	}

	value3, err := redis.Strings(redisClient.Do("LRANGE", "school", 0, -1))
	if err != nil {
		log.Fatalf("LRANGE: %s", err.Error())
	}
	//[二学期 三学期]
	fmt.Println(value3)

	_, err = redisClient.Do("DEL", "school")
	if err != nil {
		log.Fatalf("DELETE: %s", err.Error())
	}
}

```

# 構造体を保存したい
データベースから取得できるデータをそのまま保存しておいて置けるのが理想。keyをid(primary_key)にしてvalueをjsonでデコードしたデータを保存することにより実装してみる。

```go
package main

import (
	"encoding/json"
	"fmt"
	"log"
	"strconv"

	"github.com/garyburd/redigo/redis"
)

// User 構造体
type User struct {
	ID     uint64 `json:"id"`
	Name   string `json:"name"`
	Number int    `json:"number"`
}

func main() {
	// redisの初期portは6379
	port := "127.0.0.1:6379"
	redisClient, err := redis.Dial("tcp", port)
	if err != nil {
		log.Fatalf("Failed to connect: %s", err.Error())
	}
	defer redisClient.Close()

	user1 := &User{ID: 1, Name: "Tosa", Number: 1}
	user1JSON, err := json.Marshal(user1)
	if err != nil {
		log.Fatalf("Failed to marshal user: %s", err.Error())
	}
	// 2020/08/22 18:39:49 user1_json :  {"id":1,"name":"Tosa","number":1}
	log.Println("user1_json : ", string(user1JSON))

	_, err = redisClient.Do("SET", "user"+strconv.FormatUint(user1.ID, 10), string(user1JSON))
	if err != nil {
		log.Fatalf("Failed to SET: %s", err.Error())
	}

	//　user1
	fmt.Println("user" + strconv.FormatUint(user1.ID, 10))

	user, err := redis.Bytes(redisClient.Do("GET", "user"+strconv.FormatUint(user1.ID, 10)))
	if err != nil {
		log.Fatalf("Failed to get user data: %s", err.Error())
	}
	data := new(User)
	json.Unmarshal(user, data)
	// 2020/08/22 18:39:49 &{1 Tosa 1}
	log.Println(data)
}

```

これで一応構造体をredisに保存することができたが、idごとにkeyを作らなくてはいけないのが不便、かついちいちjsonにパースしなくてはならないので、あんまり使い勝手が良くなさそう。redisにはハッシュ型があるので次回はそちらで実装してみたい。またデータをsortして保存して置けるsortedリストなどのもあるらしいのでそちらも調査していく予定です。


# 参考サイト
[MacにRedisをインストールする](https://qiita.com/sawa-@github/items/1f303626bdc219ea8fa1)

[RedisをCentOS7にyumインストールする手順](https://weblabo.oscasierra.net/redis-centos7-install-yum/)

[examples-redigo](https://github.com/pete911/examples-redigo)

[LPUSHのドキュメント](https://redis.io/commands/lpush)