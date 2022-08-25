import Image from "next/image";
import React from "react";

import styles from '../../styles/Home.module.css'
import logo from "../../assets/logo.png"

const Nav = () => {
    return <nav className={styles.nav}>
        <Image src={logo} width={230} objectFit={'contain'} alt="Personarise logo" />
    </nav>;
};

export default Nav;
