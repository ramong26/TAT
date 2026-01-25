#!/bin/bash

TARGET_BRANCH=$1
SOURCE_BRANCH=$2

echo "Target: $TARGET_BRANCH"
echo "Source: $SOURCE_BRANCH"

# 최신 상태로 fetch
git fetch origin

# merge-base (공통 조상) 구하기
MERGE_BASE=$(git merge-base origin/$TARGET_BRANCH origin/$SOURCE_BRANCH)

# 커밋 목록
COMMITS=$(git log $MERGE_BASE..origin/$SOURCE_BRANCH --oneline)

# 변경 통계
DIFF_STATS=$(git diff --stat $MERGE_BASE..origin/$SOURCE_BRANCH)

# 상세 diff (토큰 초과 방지)
DIFF_CONTENT=$(git diff $MERGE_BASE..origin/$SOURCE_BRANCH | head -c 12000)

PROMPT="다음 코드 변경사항을 분석해서 Pull Request 제목과 설명을 작성해줘.

**반드시 아래 형식을 지켜줘**

첫 줄: TITLE: [제목]
둘째 줄: ---
그 다음 줄부터: 본문 (마크다운)

규칙:
- 제목은 한글
- 50자 이내
- 변경의 핵심만 요약
- 본문은 마크다운 형식
- 📝 요약, ✨ 주요 변경사항 섹션 포함

커밋 목록:
$COMMITS

변경 파일 통계:
$DIFF_STATS

상세 변경 내용:
$DIFF_CONTENT
"

FULL_RESPONSE=$(gemini -p "$PROMPT")

echo "===== Gemini Response ====="
echo "$FULL_RESPONSE"

# 제목 추출
PR_TITLE=$(echo "$FULL_RESPONSE" | grep "^TITLE:" | sed 's/^TITLE: //')

# 본문 추출
PR_BODY=$(echo "$FULL_RESPONSE" | sed '1,/^---$/d')

# GitHub Actions output 설정
echo "title=$PR_TITLE" >> "$GITHUB_OUTPUT"
echo "body<<EOF" >> "$GITHUB_OUTPUT"
echo "$PR_BODY" >> "$GITHUB_OUTPUT"
echo "EOF" >> "$GITHUB_OUTPUT"
