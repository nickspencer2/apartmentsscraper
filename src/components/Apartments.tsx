import * as React from "react";
import { ApartmentInfo } from "../scraper/ApartmentsScraper";
import { Apartment } from "./Apartment";

export interface Props {
    apartmentInfos: ApartmentInfo[],

    onBackClick: () => any
}

export interface State {
}

export class Apartments extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <div>
                <a className="waves-effect waves-light btn" onClick={_ => this.props.onBackClick()}><i className="material-icons left">arrow_back</i>Back</a>
                <table>
                    <thead>
                        <tr>
                            {Object.keys(this.props.apartmentInfos[0]).map(key => <th key={key}>{key}</th>)}
                        </tr>
                    </thead>

                    <tbody>
                        {this.props.apartmentInfos.map(apartment => <Apartment key={apartment.name} apartment={apartment}/>)}
                    </tbody>
                </table>
            </div>
        );
    }
}