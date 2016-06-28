#!/usr/bin/env sh
files=$*
output="app/font"

for filename in $files; do
    name=$(basename $filename)
    echo "url(data:application/x-font-woff;charset=utf-8;base64,$(base64 $filename)) format('woff');" > "$output/$name.base64"
done