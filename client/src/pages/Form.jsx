import styles from './Form.module.css';

function Form() {
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.formTitle}>Contact Form</h2>
      
      <div className={styles.formGroup}>
        <input
          type="email"
          className={styles.formInput}
          placeholder="Email"
          required
        />
      </div>
      
      <div className={styles.formGroup}>
        <input
          type="text"
          className={styles.formInput}
          placeholder="Product"
        />
      </div>
      
      <div className={styles.formGroup}>
        <textarea
          className={`${styles.formInput} ${styles.formTextarea}`}
          placeholder="Message"
          rows="6"
        />
      </div>
      
      <button className={styles.submitButton} type="submit">
        Send Message
      </button>
    </div>
    )
}

export default Form