import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = __ENV.BASE_URL || 'http://www.aleno.my.id';
const VUS = __ENV.VUS || '100';
const SEC= __ENV.SEC || '30';
const users = JSON.parse(open('./payload.json'));

export let options = {
  vus: `${VUS}`, // Virtual Users
  duration: `${SEC}s`, // Durasi pengujian
};

export default function () {
  const user = users[__ITER];
  const url = `${BASE_URL}/v1/auth/login`;

  const params = { headers: { 'Content-Type': 'application/json' } };

  let res = http.post(url, JSON.stringify(user), params);

  check(res, {
    'status is 200': (r) => r.status === 200, // Cek status 200
    'response contains token': (r) => JSON.parse(r.body).token !== undefined,
  });
  sleep(1); // Tunggu 1 detik antara permintaan
}
