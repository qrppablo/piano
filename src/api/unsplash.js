import axios from 'axios';

export default axios.create({
    baseURL: 'https://api.unsplash.com',
    headers: {
        Authorization: 'Client-ID K-P45t5J_Bt3_doQCy4W8zFmUYYNkR9bmPtp6oeCkFo'
    }
});