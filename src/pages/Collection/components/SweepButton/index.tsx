import Button from '../../../../components/Buttons/Button';
import { PaintBrushIcon } from '../../../../icons/PaintBrushIcon';

import styles from './styles.module.scss';

export const SweepButton = (): JSX.Element => (
  <div className={styles.sweepButtonWrapper}>
    <Button className={styles.sweepButton} outlined>
      <PaintBrushIcon />
      <span>sweep mode</span>
    </Button>
  </div>
);
