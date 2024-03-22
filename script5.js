import http from 'k6/http';
import { sleep, check, group } from 'k6';

export const options = {
    vus: 10,
    duration: '10s',
    thresholds: {
        http_req_duration: ['p(95)<250'],
        'group_duration{group:::Home page}': ['p(95)<200'],
        'group_duration{group:::Home page::Assets}': ['p(95)<200'],
        'group_duration{group:::Contact page}': ['p(95)<200'],
        'group_duration{group:::News page}': ['p(95)<200'],
    }
}

export default function () {
    group('Home page', function () {
        let home_page = http.get('https://test.k6.io', { tags: { page: 'home' } });

        group('Assets', function () {
            http.get('https://test.k6.io/static/css/site.css');
            http.get('https://test.k6.io/static/js/prisms.js');
        });

        check(home_page, {
            'Home page status is 200':
                (r) => r.status === 200,
            'Home page is loading':
                (r) => r.body.includes('Collection of simple web-pages suitable for load testing.')
        },
            { page: 'home' });;

        sleep(1);
    });

    group('Contact page', function () {
        let contact_page = http.get('https://test.k6.io/contacts.php', { tags: { page: 'contact' } });

        check(contact_page, {
            'Contact page status is 200':
                (r) => r.status === 200,
            'Contact page is loading':
                (r) => r.body.includes('Contact us')
        },
            { page: 'contact' });

        sleep(1);
    });


    group('News page', function () {
        let news_page = http.get('https://test.k6.io/news.php', { tags: { page: 'news' } });

        check(news_page, {
            'News page status is 200':
                (r) => r.status === 200,
            'News page is loading':
                (r) => r.body.includes("The Internet's symbolic birth date: publication of RFC 1.")
        },
            { page: 'news' })

        sleep(1);
    });

}
