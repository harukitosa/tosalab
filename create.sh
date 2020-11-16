#!/bin/bash
#code1

if [ $# -ne 1 ]; then
  echo "指定された引数は$#個です。" 1>&2
  echo "実行するには1個の引数が必要です。" 1>&2
  exit 1
fi

today=$(date "+%Y-%m-%d---")
file="${today}$1.md"
touch ./content/posts/${file}