import React from 'react';
import axios from 'axios';
import Masonry from 'react-masonry-component';

var masonryOptions = {
    transitionDuration: 0
};

class MyPins extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            loaded: false,
            myPins: []
        };
    }
    getMyPins = () => {
        if(this.props.loggedIn){
            axios.post('/api/getmypins', {
                user: this.props.user
            }).then((res) => {
                this.setState({
                    myPins: res.data
                });
            }).catch((err) => {
                if(err) throw err;
            });
        }
    }
    componentWillMount = () => {
        this.getMyPins();
    }
    deleteImage = (id) => {
        axios.post('/api/deleteimage', {
            id: id, 
            user: this.props.user
        }).then((res) => {
            this.getMyPins();
        }).catch((err) => {
            if(err) throw err;
        });
    }
    unpinImage = (id) => {
        axios.post('/api/unpin', {
            id: id,
            user: this.props.user
        }).then((res) => {
            this.getMyPins();
        }).catch((err) => {
            if(err) throw err;
        });
    }
    render(){
        let myPins;
        if(this.state.myPins.length > 0){
            myPins = this.state.myPins.map((pin, i) => {
                return (
                    <li className='grid-item' key={i}>
                        <MyPic 
                            imgUrl={pin.url} 
                            imgTitle={pin.title} 
                            id={pin._id} 
                            key={i} 
                            onDelete={this.deleteImage}
                            unPin={this.unpinImage} 
                            submittedBy={pin.user} 
                            user={this.props.user}
                            likes={pin.likes}
                            liked={pin.liked} />
                    </li>
                );
            });
        }
        if(!this.props.loggedIn){
            return (
                <div className='home'>
                    Please log in to see this page!
                </div>
            );
        }
        else{
            return (
                <div className='home'>
                    <span className='subTitle'>My Pinned Images:</span>
                    <Masonry
                        className={'home'}
                        elementType={'ul'} 
                        options={masonryOptions} 
                        disableImagesLoaded={false} 
                        updateOnEachImageLoad={false}> 
                        {myPins}
                    </Masonry>
                </div>
            );
        }
    }
}


const MyPic = (props) => {
    //Delete and unpin buttons depending if it was user submitted or not
    let conditionalBtn;
    if(props.submittedBy == props.user){
        conditionalBtn = <button className='btn btn-danger' onClick={() => (props.onDelete(props.id))}><b>Delete</b> <i className='fa fa-trash'></i></button>;
    }
    else{
        conditionalBtn = <button className='btn btn-danger' onClick={() => (props.unPin(props.id))}><b>Unpin</b> <i className='fa fa-thumb-tack'></i></button>;
    }
    //Like system
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
            {conditionalBtn}
            <div className='likeHeart'>{heart} {props.likes}</div>
        </div>
    )
}
export default MyPins;