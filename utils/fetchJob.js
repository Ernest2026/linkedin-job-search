const fetchJob = ({ title, count }) => {
    return fetch(`${process.env.NEXT_PUBLIC_WEB_URL}/api/jobsearch?list=${title}&val=${count}`)
        .then(res => res.json())
        .catch(err => { throw err });
};

export default fetchJob;
