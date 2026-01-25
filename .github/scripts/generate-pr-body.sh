#!/bin/bash

FILES=$(cat files.txt)
STATS=$(cat diffstat.txt)

PROMPT="너는 CodeRabbit 스타일의 GitHub PR 리뷰 봇이다.
다음 변경 내용을 바탕으로 '한글' Pull Request 본문을 작성해라.

형식은 반드시 아래를 따를 것:

## 📌 Summary
- 이 PR의 목적 요약

## ✨ Changes
- 주요 변경 사항 나열

## 🧪 Test
- 테스트 방법 또는 확인 사항

## ⚠️ Notes
- 리뷰어가 주의해서 볼 점

변경된 파일 목록:
$FILES

변경 통계:
$STATS
"

RESPONSE=$(npx @google/gemini-cli "$PROMPT" --model=gemini-2.0-flash)

echo "$RESPONSE" > pr_body.txt

gh pr edit "$PR_NUMBER" --body-file pr_body.txt
