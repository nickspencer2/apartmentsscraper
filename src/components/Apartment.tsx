import * as React from "react";
import { ApartmentInfo } from "../scraper/ApartmentsScraper";

export interface Props {
    apartment: ApartmentInfo
}

export interface State {

}

export class Apartment extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
    }

    render() {
        return (
            <tr>
                {Object.keys(this.props.apartment).map(key => <td key={key}>{this.props.apartment[key]}</td>)}
            </tr>
        );
    }
}