#!/bin/bash

TARGET_BRANCH=$1
SOURCE_BRANCH=$2
PR_NUMBER=$3

echo "Base: $TARGET_BRANCH"
echo "Head: $SOURCE_BRANCH"
echo "PR: #$PR_NUMBER"

git fetch origin

MERGE_BASE=$(git merge-base origin/$TARGET_BRANCH origin/$SOURCE_BRANCH)

COMMITS=$(git log $MERGE_BASE..origin/$SOURCE_BRANCH --oneline)
DIFF_STATS=$(git diff --stat $MERGE_BASE..origin/$SOURCE_BRANCH)
DIFF_CONTENT=$(git diff $MERGE_BASE..origin/$SOURCE_BRANCH | head -c 12000)

PROMPT="다음 코드 변경사항을 분석해서 GitHub Pull Request 본문을 작성해줘.

출력은 반드시 아래 형식만 사용:

## 📝 요약
(한글로 이 PR의 목적 요약)

## ✨ 주요 변경사항
- 변경 사항 목록

## 🔍 영향 범위
- 프론트엔드 / 백엔드 / 설정 등 영향 영역

## ✅ 테스트 방법
- 테스트 방법 요약

분석 대상:

[커밋 목록]
$COMMITS

[변경 파일 통계]
$DIFF_STATS

[상세 diff]
$DIFF_CONTENT
"

RESPONSE=$(gemini -p "$PROMPT")

echo "===== Gemini Response ====="
echo "$RESPONSE"

gh pr edit "$PR_NUMBER" --body "$RESPONSE"
