# Face Retouch · CodeFormer
> 작성자: YeonJu / Version : 1.0

CodeFormer 기반 얼굴 보정 웹앱. Vercel Edge Function으로 CORS 없이 모든 기기에서 사용 가능.

---

## 배포 순서

### 1단계 — 프로젝트 GitHub에 올리기

```bash
cd face-retouch
git init
git add .
git commit -m "init: face retouch app"
git remote add origin https://github.com/본인계정/face-retouch.git
git push -u origin main
```

### 2단계 — Vercel 연동

1. https://vercel.com 접속 → GitHub 계정으로 로그인
2. **Add New Project** → face-retouch 저장소 선택
3. **Environment Variables** 탭에서 아래 추가:

| 키 | 값 |
|---|---|
| `REPLICATE_API_TOKEN` | 발급받은 Replicate 토큰 |

4. **Deploy** 클릭 → 약 1분 후 완료

### 3단계 — 배포 URL 확인

배포 완료 후 Vercel이 URL을 발급해줌:
```
https://face-retouch-yourname.vercel.app
```

이 URL을 북마크하면 어느 기기에서든 접근 가능.

---

## 로컬 개발 실행

```bash
npm install
# .env.local 파일 생성
echo "REPLICATE_API_TOKEN=r8_your_token_here" > .env.local
npm run dev
# http://localhost:3000 에서 확인
```

---

## 파일 구조

```
face-retouch/
├── api/
│   └── retouch.js       # Vercel Edge Function (프록시)
├── public/
│   └── index.html       # 프론트엔드
├── vercel.json          # Vercel 라우팅 설정
└── package.json
```

---

## 접근 가능 환경

| 기기 | 방법 |
|---|---|
| Windows / Mac | 브라우저에서 URL 접속 |
| 아이폰 | Safari에서 URL 접속 → 홈 화면에 추가 |
| 안드로이드 | Chrome에서 URL 접속 → 홈 화면에 추가 |
