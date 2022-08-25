import Image from "next/image";
import React from "react";

import styles from '../../styles/Home.module.css'

const JobCard = ({ data: { image, title, company, location, date } }) => {
    return <div className='d-flex w-100 mt-3'>
        <div className={styles.jobimgdiv}>
            <Image alt={company} width={"100%"} height={"100%"} layout="responsive" src={image} />
        </div>
        <div className='w-100 ms-3'>
            <h5>{title}</h5>
            <h6 className='mb-1'>{company}</h6>
            <p className='mb-2'>{location}</p>
            <small>{date}</small>
        </div>
    </div>;
};

export default JobCard;
