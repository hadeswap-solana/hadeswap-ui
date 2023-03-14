import { FC } from 'react';
import styles from './styles.module.scss';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

const Checkbox: FC<CheckboxProps> = ({ label, checked, onChange }) => {
  return (
    <div className={styles.checkbox}>
      <label>
        <input
          value={label}
          onChange={onChange}
          type="checkbox"
          checked={checked}
        />
        {label}
        <span className={styles.checkboxInput}></span>
      </label>
    </div>
  );
};
export default Checkbox;
