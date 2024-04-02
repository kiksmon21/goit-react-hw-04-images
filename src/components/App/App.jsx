import React, { useState, useEffect } from 'react';
import Searchbar from '../Searchbar/Searchbar';
import ImageGallery from '../ImageGallery/ImageGallery';
import * as pixabayApi from '../utils/pixabay-api';
import Button from '../Button/Button';
import Loader from '../Loader/Loader';
import Modal from '../Modal/Modal';
import styles from '../App/App.module.css';

export const App = () => {
  const [images, setImages] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [largeImageId, setLargeImageId] = useState(null);

  useEffect(() => {
    if (search !== '') {
      fetchImages(false);
    }
  }, [search]);

  const onSearch = search => {
    setSearch(search);
    setImages([]);
    setPageNumber(1);
  };

  const fetchImagesWithScroll = () => {
    fetchImages(true);
  };

  const fetchImages = scroll => {
    setIsLoading(true);
    pixabayApi
      .fetchImages(search, pageNumber)
      .then(images => {
        setImages(prevImages => [...prevImages, ...images]);
        setPageNumber(prevPageNumber => prevPageNumber + 1);
        return images[0];
      })
      .catch(error => {
        setError(error);
      })
      .finally(() => {
        setIsLoading(false);
      })
      .then(firstLoadedImage => {
        if (scroll) {
          const { id } = firstLoadedImage;

          const y =
            document.getElementById(id).getBoundingClientRect().top +
            window.scrollY -
            80;
          window.scrollTo({
            top: y,
            behavior: 'smooth',
          });
        }
      });
  };

  const findPic = () => {
    const largeImg = images.find(image => {
      return image.id === largeImageId;
    });
    return largeImg;
  };

  const openModal = e => {
    setIsModalOpen(true);
    setLargeImageId(Number(e.currentTarget.id));
  };
  
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className={styles.App}>
      <Searchbar onSubmit={onSearch} />
      <ImageGallery openModal={openModal} images={images} />
      {isLoading && <Loader />}
      {images.length > 0 && (
        <Button fetchImages={fetchImagesWithScroll} />
      )}
      {isModalOpen && (
        <Modal largeImageId={largeImageId} onClose={closeModal}>
          <img src={findPic().largeImageURL} alt={findPic().tags} />
        </Modal>
      )}
    </div>
  );
};