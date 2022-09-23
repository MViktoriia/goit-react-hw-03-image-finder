import { Component } from "react";
import { ColorRing } from 'react-loader-spinner';
import fetchImages from "api/imagesAPI";
import ImageGallery from "components/ImageGallery/ImageGallery";
import Searchbar from "components/Searchbar/Searchbar";
import Button from "components/Button/Button";
import Modal from "components/Modal/Modal";
import Section from "components/Section/Section";


export class App extends Component {
  state = {
    images: [],
    isLoading: false,
    error: null,
    search: "",
    page: 1,
    modalOpen: false,
    modalContent: {
      largeImageURL:'',
      tags:''
    },
  }

  componentDidUpdate(_,prevState) {
    const { page, search } = this.state;
    if (prevState.search !== search) {
      this.reset();
      this.getImages(search, page);
    };
    if (prevState.page !== page) {
      this.getImages(search, page);
    };    
  };

  getImages = (search, page) => {
    this.setState({
      isLoading: true,
    });
    
    fetchImages(search, page)
      .then(({ data }) => {
        this.setState(({ images }) => {
          return {
            images: [...images, ...data.hits]
          }
        })
      })
      .catch(error => {
        this.setState({
          error
        })
      })
      .finally(this.setState({
        isLoading: false
      }))
  };

  onSubmit = ({ search } ) => {
    this.setState({
      search,
    })
  };

  reset = () => {
    this.setState({
      images: [],
    })
  };

  loadMore = () => {
    this.setState((prevState) => {
      return {
        page: prevState.page + 1,
      }
    })
  }

  closeModal = () => {
    this.setState({
      modalOpen: false,
      modalContent: {
      largeImageURL:'',
      tags:''
    },
    })
  }

  openModal = (modalContent) => {
    this.setState({
      modalOpen: true,
      modalContent: {
      largeImageURL: modalContent.largeImageURL,
      tags: modalContent.tag
    },
    })
  }

  render() {
    const { onSubmit, loadMore, closeModal, openModal } = this;
    const { images, isLoading, error, modalOpen, modalContent } = this.state;
  
    return (
      <div>
        {modalOpen && <Modal largeImageURL={modalContent.largeImageURL} description={modalContent.tags} onClose={closeModal} />}
        <Searchbar onSubmit={onSubmit} />
        {isLoading && <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="blocks-loading"
          wrapperStyle={{}}
          wrapperClass="blocks-wrapper"
          colors={['#e15b64', '#f47e60', '#f8b26a', '#abbd81', '#849b87']}
        />}
        {error && 'Please try again later...'}
        {images.length > 0 && <Section><ImageGallery images={images} onClick={openModal} /><Button text='Load more' onClick={loadMore} /></Section>}
      </div>
    );
  }
};
