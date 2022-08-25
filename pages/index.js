import Image from 'next/image'
import { useEffect, useState } from 'react'

import styles from '../styles/Home.module.css'
import Head from "../component/Head"
import searchIcon from "../assets/search.svg"
import Nav from '../component/Nav'
import JobCard from '../component/Card/Job'
import fetchJob from '../utils/fetchJob'

export default function Home({ data }) {
  const [count, setCount] = useState(1);
  const [jobs, setJobs] = useState(data);
  const [title, setTitle] = useState("");
  const [storedList, setStoredList] = useState([])

  useEffect(() => {
    if (localStorage.getItem('list')) {
      const storedData = JSON.parse(localStorage.getItem('list'))
      setStoredList(storedData);
    }
  }, []);

  const handleClear = () => {
    localStorage.clear();
    setStoredList([])
  }

  const handleSelectChange = async (e) => {
    switch (e.target.name) {
      case "count":
        setCount(e.target.value)
        count = e.target.value;
        break;

      case "title":
        setTitle(e.target.value)
        title = e.target.value;
        break;

      default:
        break;
    }
    const data = await fetchJob({ title, count })
    setJobs(data)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const initialStoreState = storedList;
    storedList.find(list => list === title) ? true : initialStoreState.push(title);
    localStorage.setItem("list", JSON.stringify(initialStoreState));
    const data = await fetchJob({ title, count })
    setJobs(data)
  }

  return (
    <div className={styles.container}>
      <Head />
      <Nav />

      <main className={styles.main}>
        <h1 className={styles.title}>
          Linkedin Job Search
        </h1>
        <p><b>Note:</b> The dropdown is a list of you most recent search, and you can also select the number of jobs you want by using the no. menu.</p>

        <div className="d-flex mb-3">
          <div className="form-group me-1" style={{ minWidth: "80px" }}>
            <select className="form-control" name='count' onChange={handleSelectChange}>
              <option>No:</option>
              <option value={1}>25</option>
              <option value={2}>50</option>
              <option value={3}>75</option>
              <option value={4}>100</option>
            </select>
          </div>
          <div className="form-group w-100">
            <select className="form-control" name='title' onChange={handleSelectChange}>
              <option value="">Select list</option>
              {storedList.length >= 1 && storedList.map((list, idx) => <option key={idx} value={list}>{list}</option>)}
            </select>
          </div>
          <div>
            <button type="button" className="btn btn-primary ms-1" onClick={handleClear}>Clear</button></div>
        </div>

        <form onSubmit={handleFormSubmit} className={styles.searchbar}>
          <div className="input-group">
            <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Search by title, skill, or company..." />
            <button className="btn btn-light" type="submit"><Image alt="search icon" src={searchIcon} height={20} width={20} /></button>
          </div>
        </form>

        {jobs && jobs.length >= 1 && jobs.map((obj, idx) => <JobCard key={idx} data={obj} />)}

      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_WEB_URL}/api/jobsearch`)
    .then(res => res.json())
    .catch((err) => { throw err })

  return {
    props: { data }
  }
}