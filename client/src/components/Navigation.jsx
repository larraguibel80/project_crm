import styles from './Navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.logo}>CRM System</div>
      <ul className={styles.navLinks}>
        <li><a href="/">Dashboard</a></li>
        <li><a href="/contacts">Contacts</a></li>
        <li><a href="/reports">Reports</a></li>
        <li><a href="/login" className={styles.loginButton}>Login</a></li>
      </ul>
    </nav>
  );
}