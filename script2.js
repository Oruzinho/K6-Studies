import http from 'k6/http';

export default function () {
    const res = http.get('https://test.k6.io');
    console.log("[status]test.k6.io:" + res.status);
    console.log("[body]test.k6.io:" + res.body);
}
