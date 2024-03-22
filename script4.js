import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';

export const options = {
    vus: 10,
    duration: '10s',
    thresholds: {
        checks: ['rate>=0.98'],
        http_req_duration: ['max<1000', 'p(95)<300'],
        'http_req_duration{page:home}': ['p(95)<200'],
        'http_req_duration{page:contact}': ['p(95)<200'],
        'http_req_duration{page:news}': ['p(95)<200'],
        http_req_failed: ['rate<0.01'],
        http_reqs: ['rate>4', 'count>30']
    }
}

export default function () {
    let home_page = http.get('https://test.k6.io', { tags: { page: 'home' } });

    check(home_page, {
        'Home page status is 200':
            (r) => r.status === 200,
        'Home page is loading':
            (r) => r.body.includes('Collection of simple web-pages suitable for load testing.')
    },
        { page: 'home' });;

    sleep(1);

    let contact_page = http.get('https://test.k6.io/contacts.php', { tags: { page: 'contact' } });

    check(contact_page, {
        'Contact page status is 200':
            (r) => r.status === 200,
        'Contact page is loading':
            (r) => r.body.includes('Contact us')
    },
        { page: 'contact' });

    sleep(1);

    let news_page = http.get('https://test.k6.io/news.php', { tags: { page: 'news' } });

    check(news_page, {
        'News page status is 200':
            (r) => r.status === 200,
        'News page is loading':
            (r) => r.body.includes("The Internet's symbolic birth date: publication of RFC 1.")
    },
        { page: 'news' })

    sleep(1);
}
