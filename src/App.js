import React, { Component } from "react";
import Navigation from "./components/Navigation/Navigation";
import Logo from "./components/Logo/Logo";
import Particles from "react-particles-js";
import Rank from "./components/Rank/Rank";
import ImageLinkForm from "./components/ImageLinkForm/ImageLinkForm";
import SignIn from "./components/SignIn/SignIn";
import SignUp from "./components/SignUp/SignUp";
import FaceRecognition from "./components/FaceRecognition/FaceRecognition";
import "./App.css";

const particlesOptions = {
    particles: {
        number: {
            value: 100,
            density: {
                enable: true,
                value_area: 800
            }
        }
    }
};

const initialState = {
    input: "",
    imageUrl: "",
    box: {},
    route: "signIn",
    isSignedIn: false,
    user: {
        id: '',
        name: '',
        email: '',
        entities: 0,
        joined: ''
    }
};

class App extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    calculateFaceLocation = data => {
        const {
            left_col,
            top_row,
            right_col,
            bottom_row
        } = data.outputs[0].data.regions[0].region_info.bounding_box;
        const image = document.getElementById("input-image");
        const width = Number(image.width);
        const height = Number(image.height);
        return {
            leftCol: left_col * width,
            topRow: top_row * height,
            rightCol: width - right_col * width,
            bottomRow: height - bottom_row * height
        };
    };

    loadUser = (data) => {
        this.setState({user: {
                id: data.id,
                name: data.name,
                email: data.email,
                entities: data.entities,
                joined: data.joined
            }});
    };

    displayFaceBox = box => {
        this.setState({ box });
    };

    onInputChange = event => {
        this.setState({ input: event.target.value });
    };

    onSubmit = () => {
        this.setState({ imageUrl: this.state.input });
        fetch('https://arcane-brook-87615.herokuapp.com/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                input: this.state.input
            })
        })
            .then((response) => response.json())
            .then(response => {
                if (response) {
                   fetch('https://arcane-brook-87615.herokuapp.com/image', {
                       method: 'put',
                       headers: {'Content-Type': 'application/json'},
                       body: JSON.stringify({
                           id: this.state.user.id
                       })
                   })
                       .then((response) => response.json())
                       .then((count) => {
                           this.setState(Object.assign(this.state.user, { entities: count}));
                       })
                       .catch(console.log)
                }
                this.displayFaceBox(this.calculateFaceLocation(response))
            })
            .catch(err => console.log(err));
    };

    onRouteChange = route => {
        if (route === 'signOut') {
            this.setState(initialState);
        } else if (route === 'home') {
            this.setState({isSignedIn: true});
        }
        this.setState({ route });
    };

    render() {
        const {isSignedIn, imageUrl, route, box} = this.state;
        return (
            <div className="App">
                <Particles className="particles" params={particlesOptions} />
                <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
                {route === "home" ?
                    <div>
                        <Logo />
                        <Rank name={this.state.user.name} entities={this.state.user.entities} />
                        <ImageLinkForm
                            onInputChange={this.onInputChange}
                            onButtonSubmit={this.onSubmit}
                        />
                        <FaceRecognition
                            box={box}
                            imageUrl={imageUrl}
                        />
                    </div>
                 : (
                    route === "signIn"
                         ? <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                         : <SignUp loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
                    )
                }
            </div>
        );
    }
}

export default App;
