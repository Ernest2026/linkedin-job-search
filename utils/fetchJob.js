const fetchJob = ({ title, position }) => {
    return fetch(`${process.env.NEXT_PUBLIC_WEB_URL}/api/jobsearch?list=${title}&position=${position}`)
        .then(res => res.json())
        .catch(err => { throw err });
};

export default fetchJob;
