/**
 * buzhala-reviews — Cloudflare Worker
 * -------------------------------------
 * Liefert Google-Bewertungen für gartenpflegeservicebuzhala.de
 *
 * - Pull 1×/Tag von Google Places API (Cron 04:00 UTC)
 * - Cache in KV (24h TTL)
 * - CORS-Header für Frontend-Zugriff
 * - Optional: ?nocache=1 bypass (für Force-Refresh)
 */

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json; charset=utf-8',
  'Cache-Control': 'public, max-age=3600', // 1h Browser-Cache zusätzlich zu KV
};

const KV_KEY = 'reviews_v1';
const CACHE_TTL_SECONDS = 86400; // 24h

export default {
  // HTTP-Handler: GET /api/reviews → liefert Reviews-JSON
  async fetch(request, env) {
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: CORS_HEADERS });
    }

    const url = new URL(request.url);
    const forceRefresh = url.searchParams.get('nocache') === '1';

    try {
      let data;
      if (!forceRefresh) {
        data = await env.REVIEWS_CACHE.get(KV_KEY, 'json');
      }

      if (!data) {
        data = await this.fetchFromGoogle(env);
        // Cache speichern (auch wenn Fehler, mit kurzer TTL, damit Frontend nicht ewig warten muss)
        if (data && !data.error) {
          await env.REVIEWS_CACHE.put(KV_KEY, JSON.stringify(data), {
            expirationTtl: CACHE_TTL_SECONDS,
          });
        }
      }

      return new Response(JSON.stringify(data), {
        headers: CORS_HEADERS,
      });
    } catch (e) {
      return new Response(
        JSON.stringify({ error: 'internal', message: e.message }),
        { status: 500, headers: CORS_HEADERS },
      );
    }
  },

  // Cron-Handler: täglich 04:00 UTC → force refresh
  async scheduled(event, env) {
    try {
      const data = await this.fetchFromGoogle(env);
      if (data && !data.error) {
        await env.REVIEWS_CACHE.put(KV_KEY, JSON.stringify(data), {
          expirationTtl: CACHE_TTL_SECONDS,
        });
        console.log(`[cron] Reviews refreshed: ${data.reviews?.length || 0} reviews, rating ${data.rating}`);
      }
    } catch (e) {
      console.error(`[cron] refresh failed: ${e.message}`);
    }
  },

  // Google Places API Call
  async fetchFromGoogle(env) {
    const apiKey = env.GOOGLE_PLACES_API_KEY;
    const placeId = env.PLACE_ID;
    if (!apiKey || !placeId) {
      return { error: 'config_missing', message: 'GOOGLE_PLACES_API_KEY oder PLACE_ID fehlt' };
    }

    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}&language=de&reviews_sort=newest`;
    const response = await fetch(url, { cf: { cacheTtl: 0 } });
    const data = await response.json();

    if (data.status !== 'OK') {
      return { error: 'google_api', status: data.status, message: data.error_message };
    }

    // Reviews aufbereiten: nur 3-5 neueste, ohne HTML, mit Foto-URL
    const reviews = (data.result.reviews || [])
      .slice(0, 5)
      .map((r) => ({
        author: r.author_name,
        author_url: r.author_url,
        profile_photo: r.profile_photo_url,
        rating: r.rating,
        text: r.text,
        time: r.relative_time_description,
        timestamp: r.time,
      }));

    return {
      name: data.result.name,
      rating: data.result.rating,
      total: data.result.user_ratings_total,
      reviews,
      fetched_at: new Date().toISOString(),
    };
  },
};
