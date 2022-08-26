import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import styles from '../styles/Home.module.css'
import Head from "../component/Head"
import searchIcon from "../assets/search.svg"
import Nav from '../component/Nav'
import JobCard from '../component/Card/Job'
import fetchJob from '../utils/fetchJob'

export default function Home(data) {
  const selectListRef = useRef(null);
  const searchRef = useRef(null);
  const [jobs, setJobs] = useState(data);
  const [storedList, setStoredList] = useState([])
  const [position, setPosition] = useState(1);

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
    if (e.target.name === "title") {
      searchRef.current.value = selectListRef.current.value;
    }
    const data = await fetchJob({ title: searchRef.current.value, position })
    setJobs(data)
  }

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const initialStoreState = storedList;
    storedList.find(list => list === searchRef.current.value) ? true : initialStoreState.push(searchRef.current.value);
    localStorage.setItem("list", JSON.stringify(initialStoreState));
    const data = await fetchJob({ title: searchRef.current.value, position })
    setJobs(data)
  }

  const handlePagination = async (e) => {
    let pos;
    if (e.target.dataset.position === "previous") {
      setPosition(() => position > 1 ? position - 1 : 1);
      pos = position > 1 ? position - 1 : 1;
    } else if (e.target.dataset.position === "next") {
      setPosition(() => position < Math.ceil(jobs.jobCount / 25) ? position + 1 : position)
      pos = position < Math.ceil(jobs.jobCount / 25) ? position + 1 : position;
    }
    const data = await fetchJob({ title: searchRef.current.value, position: pos })
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
          <div className="form-group w-100">
            <select className="form-control" name='title' ref={selectListRef} onChange={handleSelectChange}>
              <option value="">Select list</option>
              {storedList && storedList.length >= 1 && storedList.map((list, idx) => <option key={idx} value={list}>{list}</option>)}
            </select>
          </div>
          <div>
            <button type="button" className="btn btn-primary ms-1" onClick={handleClear}>Clear</button></div>
        </div>

        <form onSubmit={handleFormSubmit} className={styles.searchbar}>
          <div className="input-group">
            <input type="text" className="form-control" ref={searchRef} placeholder="Search by title, skill, or company..." />
            <button className="btn btn-light" type="submit"><Image alt="search icon" src={searchIcon} height={20} width={20} /></button>
          </div>
        </form>

        {jobs.data && jobs.data.length >= 1 && jobs.data.map((obj, idx) => <JobCard key={idx} data={obj} />)}

        <ul className="pagination d-flex justify-content-center mt-3">
          <li className="page-item"><button className="page-link mx-1" data-position="previous" onClick={handlePagination}>Previous</button></li>
          <li className="page-item"><button className="page-link mx-1" data-position="next" onClick={handlePagination}>Next</button></li>
        </ul>
      </main>
    </div>
  )
}

export async function getServerSideProps() {
  const data = await fetch(`${process.env.NEXT_PUBLIC_WEB_URL}/api/jobsearch`)
    .then(res => res.json())
    .catch((err) => { throw err })

  return {
    props: data
  }
}