import React from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-component';

class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loaded: false,
            allPins: []
        };
    }
    componentWillMount = () => {
        this.getPins();
    }
    componentWillReceiveProps = () => {
        console.log('mytass');
    }
    getPins = () => {
        console.log('getting pins');
        axios.get('/api/allpins').then((res) => {
            // console.log(res);
            this.setState({
                loaded: true,
                allPins: res.data
            });
        }).catch((err) => {
            console.log(err);
        });
    }
    pinImage = (id) => {
        axios.post('/api/pinimage', {
            id: id,
            user: this.props.user
        }).then((res) => {
                console.log('Pinned');
                this.getPins();
        }).catch((err) => {
                if(err) throw err;
        });
    }
    likeImage = (id) => {
        axios.post('/api/like', {
            id: id,
            user: this.props.user
        }).then((res) => {
                 this.getPins();
        }).catch((err) => {
                if(err) throw err;
        });
    }
    
    render() {
        if(!this.state.loaded){
            return(
                <div className='home'>
                    <span className='subTitle'>Loading images...</span>
                </div>
            )
        }
        else{

            return(
                <div className='home'>
                    <span className='subTitle'>All Pinned Images: </span><br/>
                    <Gallery allPins={this.state.allPins} onLike={this.likeImage} onPin={this.pinImage} user={this.props.user} />
                </div>
            );
        }
    }
}

var masonryOptions = {
    transitionDuration: 0
};

class Gallery extends React.Component {
    constructor(props){
        super(props);
        this.state = {};
    }
    render() {
        var childElements = this.props.allPins.map((pin, i) => {
            return (
                <li className='grid-item' key={i}>
                    <PinnedPic 
                            imgUrl={pin.url} 
                            imgTitle={pin.title} 
                            id={pin._id}
                            user={this.props.user}
                            likes={pin.likes} 
                            liked={pin.liked}
                            onPin={this.props.onPin} 
                            onLike={this.props.onLike} />
                        
                </li>
            );
        });
        return (
            <Masonry
                className={'home'} 
                elementType={'ul'} 
                options={masonryOptions} 
                disableImagesLoaded={false} // 
                updateOnEachImageLoad={false}> 
                {childElements}
            </Masonry>
        )
    }
}
const PinnedPic = (props) => {
    // console.log(props);
    var heart;
    let alreadyLiked = false;
    props.liked.forEach((user) => {
        if(user == props.user){
            alreadyLiked = true;
        }
    });
    if(!alreadyLiked){
        heart = <i className='fa fa-heart-o' onClick={() => (props.onLike(props.id))}></i>;
    }
    else{
        heart = <i className='fa fa-heart' onClick={() => (props.onLike(props.id))}></i>;
    }
    return (
        <div>
            <div className='pic'>
               <img src={props.imgUrl} height='100%'width='100%'/>
            </div>
            {props.imgTitle}<br/>
            <button className='btn btn-pin' onClick={() => (props.onPin(props.id))}>Pin This <i className='fa fa-thumb-tack'></i></button>
            <div className='likeHeart'>{heart} {props.likes}</div>
        </div>
    )
}

export default Home;
