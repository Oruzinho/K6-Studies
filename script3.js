import http from 'k6/http';
import { check } from 'k6';
import { sleep } from 'k6';
import { Trend } from 'k6/metrics'

export const options = {
    vus: 10,
    duration: '10s',
    thresholds: {
        checks: ['rate>=0.98'],
        http_req_duration: ['max<2000', 'p(95)<200'],
        response_time_home_page: ['max<200', 'p(95)<200'],
        response_time_contact_page: ['max<200', 'p(95)<200'],
        response_time_news_page: ['max<200', 'p(95)<200'],
        http_req_failed: ['rate<0.01'],
        http_reqs: ['rate>4', 'count>30']
    }
}

let homePageResponseTrend = new Trend('response_time_home_page');
let contactPageResponseTrend = new Trend('response_time_contact_page');
let newsPageResponseTrend = new Trend('response_time_news_page');

export default function () {
    let home_page = http.get('https://test.k6.io');
    homePageResponseTrend.add(home_page.timings.duration);

    check(home_page, {
        'Home page status is 200':
            (r) => r.status === 200,
        'Home page is loading':
            (r) => r.body.includes('Collection of simple web-pages suitable for load testing.')
    });;
    sleep(1);

    let contact_page = http.get('https://test.k6.io/contacts.php');
    contactPageResponseTrend.add(contact_page.timings.duration);

    check(contact_page, {
        'Contact page status is 200':
            (r) => r.status === 200,
        'Contact page is loading':
            (r) => r.body.includes('Contact us')
    });
    sleep(1);

    let news_page = http.get('https://test.k6.io/news.php');
    newsPageResponseTrend.add(news_page.timings.duration);

    check(news_page, {
        'News page status is 200':
            (r) => r.status === 200,
        'News page is loading':
            (r) => r.body.includes("The Internet's symbolic birth date: publication of RFC 1.")
    })
    sleep(1);
}
