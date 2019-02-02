import * as React from "react";
import logo from './logo.svg';
import "./App.css";
import { BingMapsClient } from "../scraper/BingMapsClient";
import { ApartmentsScraper, ApartmentComplexInfo } from "../scraper/ApartmentsScraper";
import { Results } from "./Results";

const config = require("../config.json");

export interface LocationInfo {
    address: string,
    city: string,
    state: string,
    postalCode: string,
}

export interface Props {

}

export interface State {
    currentLocation: LocationInfo,
    currentApartmentComplexInfo?: ApartmentComplexInfo[],
    locations: Map<string, ApartmentComplexInfo[]>,
    [field: string]: any
}

class App extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            currentLocation: {
                address: "",
                city: "",
                state: "",
                postalCode: ""
            },
            locations: new Map<string, ApartmentComplexInfo[]>()
        }
    }

    serializeLocationInfo = (location: LocationInfo): string => {
        return [location.address, location.city, location.state, location.postalCode].join("");
    }

    handleSubmit = async (event: any) => {
        if (event) event.preventDefault();
        const bingMapsClient = new BingMapsClient(config.bingmapsapikey);
        const apartmentsScraper = new ApartmentsScraper(bingMapsClient);
        try {
            const location = this.state.currentLocation;
            const workLocation = await bingMapsClient.getLatLng(location.address, location.city, location.state, location.postalCode);
            const apartmentComplexes = (await apartmentsScraper.getApartmentComplexes(location.city, location.state, workLocation))
                .filter(apartmentComplex => apartmentComplex) // Filter out undefined results
                .map(apartmentComplex => apartmentComplex!); // Assert that the contents are no longer undefined
            console.log("apartmentComplexes:");
            console.log(apartmentComplexes);
            this.setState({
                currentApartmentComplexInfo: apartmentComplexes,
            });
        } catch (err) {
            console.error("There was an error:");
            console.error(err);
        }
    }

    handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const name = event.target.id;
        const value = event.target.value;
        const newCurrentLocation: any = this.state.currentLocation;
        newCurrentLocation[name] = value;
        this.setState({
            currentLocation: newCurrentLocation
        });
    }

    render() {
        return (
            !this.state.currentApartmentComplexInfo ? 
            <div className="valign-wrapper row login-box">
                <div className="col card hoverable s10 pull-s1 m6 pull-m3 l4 pull-l4">
                    <form onSubmit={this.handleSubmit} style={{ display: "inline" }}>
                        <div className="card-content">
                            <span className="card-title">Enter Work Location</span>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input placeholder="123 Place Street" id="address" type="text" className="validate" onChange={this.handleChange} value={this.state.address} />
                                    <label>Address</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input placeholder="New York" id="city" type="text" className="validate" onChange={this.handleChange} value={this.state.city} />
                                    <label>City</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input placeholder="NY" id="state" type="text" className="validate" onChange={this.handleChange} value={this.state.state} />
                                    <label>State</label>
                                </div>
                            </div>
                            <div className="row">
                                <div className="input-field col s12">
                                    <input placeholder="123456" id="postal-code" type="text" className="validate" onChange={this.handleChange} value={this.state.postalCode} />
                                    <label>Postal Code</label>
                                </div>
                            </div>
                        </div>
                        <div className="card-action right-align">
                            <a className="btn waves-effect waves-light" onClick={this.handleSubmit}>Submit</a>
                        </div>
                    </form>
                </div>
            </div>
            :
            <Results results={this.state.currentApartmentComplexInfo}/>
        );
    }
}

export default App;
