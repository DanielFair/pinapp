import React from 'react';
import axios from 'axios';

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
    getPins = () => {
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
            let displayPins = this.state.allPins.map((pin, i) => {
                return <div className='grid-item'>
                        <PinnedPic 
                            imgUrl={pin.url} 
                            imgTitle={pin.title} 
                            key={i} id={pin._id}
                            user={this.props.user}
                            likes={pin.likes} 
                            liked={pin.liked}
                            onPin={this.pinImage} 
                            onLike={this.likeImage} />
                        </div>;
            });
            return(
                <div className='home'>
                    <span className='subTitle'>All Pinned Images: </span><br/>
                    <div className="grid" data-masonry='{ "itemSelector": ".grid-item", "columnWidth": 200 }'>
                        {displayPins}
                    </div>
                </div>
            );
        }
    }
}

const PinnedPic = (props) => {
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
