import http from 'k6/http';
import { sleep } from 'k6'

export const options = {
    stages: [
        {
            target: 1000,
            duration: "2m"
        },
        {
            target: 0,
            duration: "1m"
        }
    ]
}

export default function () {
    http.get('https://test.k6.io');
    sleep(1);
}
