import { PlusCircleIcon } from '@phosphor-icons/react';
import styles from './AddBtn.module.css';

const AddBtn = ({ onClick, text = 'Add Book' }) => {
  return (
    <button type="button" className={styles.addBtn} onClick={onClick}>
      {text} <PlusCircleIcon size={20} />
    </button>
  );
};

export default AddBtn;
