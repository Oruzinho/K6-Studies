import http from 'k6/http';
import { sleep, check, group } from 'k6';
import { Counter } from 'k6/metrics';

export const options = {
    vus: 1,
    duration: '5s',
    thresholds: {
        http_req_duration: ['p(95)<250'],
        'http_req_duration{expected_response:true}': ['p(95)<1500'],
        'group_duration{group:::Home page}': ['p(95)<1500'],
        'group_duration{group:::Home page::Assets}': ['p(95)<500'],
        'group_duration{group:::Contact page}': ['p(95)<200'],
        'group_duration{group:::News page}': ['p(95)<200'],
    }
}

export default function () {
    group('Home page', function () {
        let home_page = http.get('https://run.mocky.io/v3/6a3a5be0-2db9-4667-92ca-3e0ef20c572a?mocky-delay=1000ms', { tags: { page: 'home' } });

        group('Assets', function () {
            http.get('https://run.mocky.io/v3/6a3a5be0-2db9-4667-92ca-3e0ef20c572a?mocky-delay=200ms');
            http.get('https://run.mocky.io/v3/6a3a5be0-2db9-4667-92ca-3e0ef20c572a?mocky-delay=200ms');
        });

        check(home_page, {
            'Home page status is 200':
                (r) => r.status === 200,
        },
            { page: 'home' });;

        sleep(1);
    });

    group('Contact page', function () {
        let contact_page = http.get('https://run.mocky.io/v3/0e081fee-c53b-425f-a08b-a9b906b2332e', { tags: { page: 'contact' } });

        check(contact_page, {
            'Contact page status is 200':
                (r) => r.status === 200,
        },
            { page: 'contact' });

        sleep(1);
    });


    group('News page', function () {
        let news_page = http.get('https://run.mocky.io/v3/0e081fee-c53b-425f-a08b-a9b906b2332e', { tags: { page: 'news' } });

        check(news_page, {
            'News page status is 200':
                (r) => r.status === 200,
        },
            { page: 'news' })

        sleep(1);
    });
}
