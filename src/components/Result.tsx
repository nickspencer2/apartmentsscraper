import * as React from "react";
import { ApartmentComplexInfo } from "../scraper/ApartmentsScraper";

export interface Props {
    result: ApartmentComplexInfo,
    index: number

    showItems: (index: number) => any
}

export interface State {
    showItems: boolean
}

export class Result extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            showItems: false
        };
    }

    render() {
        return (
            <tr>{Object.keys(this.props.result).map((key, index) => {
                return <td key={key}>{typeof this.props.result[key] === 'object' ? 
                    <a className="waves-effect waves-light btn" onClick={_ => this.props.showItems(this.props.index)}>items</a>
                    : 
                    this.props.result[key]}
                </td>
            })}</tr>
        );
    }
}