import { FC, useState } from 'react';
import classNames from 'classnames';
import placeholderImage from '../../../assets/placeholderImage.png';
import styles from './styles.module.scss';

interface ImageHolderProps {
  imageUrl: string;
  alt?: string;
  className?: string;
}

export const ImageHolder: FC<ImageHolderProps> = ({
  imageUrl,
  alt = 'NFT image',
  className,
}) => {
  const [isLoaded, setLoaded] = useState<boolean>(false);

  const onloadImage = () => {
    setLoaded(true);
  };

  return (
    <>
      <img
        className={classNames(
          styles.image,
          { [styles.imageVisible]: isLoaded },
          className,
        )}
        src={imageUrl}
        alt={alt}
        onLoad={onloadImage}
      />
      <img
        className={classNames(
          styles.placeholder,
          { [styles.placeholderHidden]: isLoaded },
          className,
        )}
        src={placeholderImage}
        alt="placeholder image"
      />
    </>
  );
};
