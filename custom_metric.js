import http from 'k6/http';
import { sleep } from 'k6';
import { Counter } from 'k6/metrics'

export const options = {
    vus: 10,
    duration: "5s"
}

let homeCounter = new Counter("acessou_homepage")

export default function () {
    http.get('https://test.k6.io');
    homeCounter.add(1)
    sleep(1);
}
