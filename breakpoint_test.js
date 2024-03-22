import http from 'k6/http';
import { sleep } from 'k6'

export const options = {
    stages: [
        {
            target: 10000,
            duration: "2h"
        }
    ]
}

export default function () {
    http.get('https://test.k6.io');
    sleep(1);
}
