/**
 * Description: Replicate CodeFormer API 프록시 엔드포인트
 * 작성자: YeonJu / Version : 1.0
 *
 * Vercel Edge Function으로 동작하며 CORS 문제를 해결하고
 * Replicate API 키를 서버 환경변수로 안전하게 관리합니다.
 */

export const config = { runtime: 'edge' };

const CODEFORMER_VERSION = '7de2ea26c616d5bf2245ad0d5e24f0ff9a6204578a5c876db53142edd9d2cd56';
const REPLICATE_API = 'https://api.replicate.com/v1';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

export default async function handler(req) {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }

  const API_KEY = process.env.REPLICATE_API_TOKEN;
  if (!API_KEY) {
    return new Response(
      JSON.stringify({ error: 'REPLICATE_API_TOKEN 환경변수가 설정되지 않았습니다.' }),
      { status: 500, headers: CORS_HEADERS }
    );
  }

  const url = new URL(req.url);
  const path = url.searchParams.get('path') || '';

  // GET /api/retouch?path=status&id={predictionId} → 상태 폴링
  if (req.method === 'GET' && path === 'status') {
    const id = url.searchParams.get('id');
    if (!id) {
      return new Response(
        JSON.stringify({ error: 'prediction id가 필요합니다.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }
    const res = await fetch(`${REPLICATE_API}/predictions/${id}`, {
      headers: { Authorization: `Token ${API_KEY}` },
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: CORS_HEADERS });
  }

  // POST /api/retouch → 보정 작업 생성
  if (req.method === 'POST') {
    let body;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: '요청 본문이 올바르지 않습니다.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { image, codeformer_fidelity = 0.7, background_enhance = true, face_upsample = true } = body;

    if (!image) {
      return new Response(
        JSON.stringify({ error: 'image 필드가 필요합니다.' }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const res = await fetch(`${REPLICATE_API}/predictions`, {
      method: 'POST',
      headers: {
        Authorization: `Token ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        version: CODEFORMER_VERSION,
        input: { image, codeformer_fidelity, background_enhance, face_upsample },
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status, headers: CORS_HEADERS });
  }

  return new Response(
    JSON.stringify({ error: '허용되지 않는 메서드입니다.' }),
    { status: 405, headers: CORS_HEADERS }
  );
}
