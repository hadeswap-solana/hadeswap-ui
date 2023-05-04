import React from 'react';
import styles from './styles.module.scss';

interface ToggleProps {
  label: string;
  checked: boolean;
  onChange: () => void;
}

export const Toggle = ({ label, checked, onChange }: ToggleProps) => {
  return (
    <div className={styles.toggler}>
      <label>
        <input
          value={label}
          onChange={onChange}
          checked={checked}
          type="checkbox"
        />

        <div className={styles.sliderWrap}>
          <span>{label}</span>
          <div className={styles.slider}>
            <span />
          </div>
        </div>
      </label>
    </div>
  );
};
