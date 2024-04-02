import React, { useState, useEffect, useCallback } from 'react';
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
  const [isFetching, setIsFetching] = useState(false);

  const fetchImages = useCallback((page, isScroll) => {
    setIsLoading(true);
    setError('');
    pixabayApi
      .fetchImages(search, page)
      .then(images => {
        if (isScroll) {
          setImages(prevImages => [...prevImages, ...images]);
        } else {
          setImages(images);
        }
        setPageNumber(page + 1);
        return images[0];
      })
      .then(firstLoadedImage => {
        if (isScroll) {
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
      })
      .catch(error => {
        setError("An error occurred while fetching images. Please try again later.");
      })
      .finally(() => {
        setIsLoading(false);
        setIsFetching(false); 
      });
  }, [search]);

  useEffect(() => {
    if (search !== '') {
      fetchImages(1, false);
    }
  }, [search, fetchImages]);

  const onSearch = search => {
    setSearch(search);
    setImages([]);
    setPageNumber(1);
  };

  const fetchImagesWithLoadMore = () => {
    setIsFetching(true);
    fetchImages(pageNumber, true);
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
      {images.length > 0 && !isFetching && (
        <Button fetchImages={fetchImagesWithLoadMore} />
      )}
      {error && <p>Error: {error}</p>}
      {isModalOpen && (
        <Modal largeImageId={largeImageId} onClose={closeModal}>
          <img src={findPic().largeImageURL} alt={findPic().tags} />
        </Modal>
      )}
    </div>
  );
};
