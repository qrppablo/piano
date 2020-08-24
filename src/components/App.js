import React from 'react';
import randomWords from 'random-words';
import { Helmet } from 'react-helmet'
import unsplash from '../api/unsplash';
import Piano from './Piano';
import SearchBar from './SearchBar';
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

class App extends React.Component {
    constructor(props){
        super(props);
        this.state = {  images: [], 
                        keyCode: null, 
                        formFocus: false, 
                        firstVisit: true,
                        noResults: false,
                        imgIndex: 0,
                        random: true,
                        loading: false
                    }
    }

    //  Gets the focus status from the field form of the SearchBar component.

    getFormStatus = (props) => {
        this.setState({ formFocus: props });
    }

    //  Listens for a key pressed by the user.

    componentDidMount = () => {

        this.keys = document.querySelectorAll('.key');   

        this.audios = document.querySelectorAll('audio');  

        window.addEventListener("keydown", e => {this.onKeyPressed(e)});

        this.setRandomBackground(this.getRandomWord());

    }

    //  If the SearchBar field form is onFocus, the user is unable to play the piano.

    onKeyPressed = (e) => {

        if(!this.state.formFocus) {

            this.setState({ keyCode: e.keyCode });

        } else {

            this.setState({ keyCode: null });   

        }

    }

    /*
    
        If the user presses a key, it checks if the keycode is equal to any 
        of the piano key elements dataset numbers. If there's a match, 
        plays the audio associated with it and shows a pressed piano key animation.

    */

    componentDidUpdate = () => {

        if(!this.state.formFocus) {

            this.keys.forEach((current, index) => {  

                if (current.dataset.key == this.state.keyCode) { 
    
                current.classList.contains("n") ? 
                current.classList.add("n-press") : current.classList.add("s-press");

                this.audios[index].currentTime = 0;  

                this.audios[index].play(); 

                current.classList.contains("n-press") ? 
                setTimeout(() => {current.classList.remove("n-press");}, 100) :
                setTimeout(() => {current.classList.remove("s-press");}, 100); 

                }

            });

        }

    }

    /*
    
        Sends a query to the unsplash API and gets an array containing a set of images.

        When the user visits the page, this function is invoked from the
        setRandomBackground function and receives a random word as prop for the query.
        If there are no results, it invokes the setRandomBackground
        function again until it gets it. 
    
        Also, this gets the keyword prop from the SearchBar component after
        the user submits a new search. 
        If there are no results, it shows a message to the user. 

    */

    onSearchSubmit = async(keyword) => {
      
        const response = await unsplash.get('/search/photos', {
            params: { query: keyword }
        });

        this.setState({ images: response.data.results });

        let results = this.state.images.length;
        let images = this.state.images;
        let firstVisit = this.state.firstVisit;

        if (results) {

            this.setState({ noResults: false });

            if (firstVisit) {

                this.changeBackground('random');

                this.setState({ firstVisit: false });

            } else {
        
                this.changeBackground();

                this.setState({ random: false });
            }

        } else {

            if(firstVisit) {

                this.setRandomBackground(this.getRandomWord());

            } else {

                this.setState({ noResults: true });

            }

        }

    }

    /* 

        Changes the background image according to the prop action received:

        1) default:     Sets the first image located in the [0] index 
                        of the images array prop as background.

        2) random:      Gets a random number from 0 to images array prop
                        length -1 and sets the image located in the 
                        [random] index of the array as background.

        3) next/prev:   Iterates the images array prop according to the
                        button pressed by the user on the SearchBar component and sets the image 
                        contained in the next/previous index of the array as background.

    */ 

    changeBackground = (action = 'default') => {

        const settings = 'background-image: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6))';
        const background = document.getElementById('background');
        const images = this.state.images;
        const imgIndex = this.state.imgIndex;
        
        this.createImg = (index, el) => { // Sets new background image when it's fully loaded
            
            let imageUrl = images[index].urls.full;

            this.setState({ loading: true })

            document.getElementsByClassName('btn')[el].classList.add('loading'); // Shows loading animation
            
            let loadingImg = document.createElement("img"); 

            loadingImg.src = imageUrl;
            
            loadingImg.addEventListener('load', () => {

                this.setState({ loading: false })

                document.getElementsByClassName('btn')[el].classList.remove('loading');

                background.style = `${settings}, url(${imageUrl});`;

                loadingImg = null;
                
            });

            this.setState({ keyCode: null })

        }

        switch(action) {

            case "random":
                
                const random = Math.ceil(Math.random() * (images.length - 1));

                background.style = `${settings}, url(${images[random].urls.regular});`;
            
                break;

            case "next":
              
                this.setState((prevState) => {
                    return { imgIndex: prevState.imgIndex + 1 };
                });
                
                this.createImg(imgIndex + 1, 1);

                break;

            case "prev":

                this.setState((prevState) => {
                    return { imgIndex: prevState.imgIndex - 1 };
                });

                this.createImg(imgIndex - 1, 0);

                break;

            default: 

                this.setState({ imgIndex: 0 });

                this.createImg(0, 1);

        }

    }

    getRandomWord = () => {
        return randomWords({ exactly: 1, min: 4, max: 10 })[0];
    }

    setRandomBackground = (randomWord) => {
        this.onSearchSubmit(randomWord);
    }

    render() {
        return (
            <div className="wrapper" id="background">
            <Helmet>
                <title>Piano JS</title>
            </Helmet>
            <div className="inner">
                <Piano />
                <p className="copyr">&copy; Pablo Torres</p>
                <div className="inner__bottom">
                    <div className="inner__bottom--form">
                        <div className="btn">
                            <IoIosArrowDropleft 
                                onClick={e => this.state.loading ? null : this.changeBackground('prev')} 
                                style={{visibility: this.state.imgIndex > 0 && 
                                                    !this.state.random && !this.state.noResults &&
                                                    !this.state.loading ? 'visible' : 'hidden' }}
                                className="icon-arrow" 
                                size={30}
                            />
                            </div>
                        <SearchBar 
                            getFormStatus={this.getFormStatus}
                            onSubmit={this.onSearchSubmit} 
                        />
                        <div className="btn">
                            <IoIosArrowDropright 
                                onClick={e => this.state.loading ? null : this.changeBackground('next')} 
                                style={{visibility: this.state.imgIndex < (this.state.images.length - 1) && 
                                                    !this.state.random && !this.state.noResults &&
                                                    !this.state.loading ? 'visible' : 'hidden' }}
                                className="icon-arrow" 
                                size={30}
                            />
                        </div>
                    </div>
                </div>
                <p className="no-result" style={{visibility: this.state.noResults ? 'visible' : 'hidden' }}>
                    No results found
                </p>
            </div>
            </div>
        );
    }

}

export default App;